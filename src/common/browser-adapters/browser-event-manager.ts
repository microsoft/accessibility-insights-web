// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { isPromise } from 'common/promises/is-promise';
import { ExternalResolutionPromise, PromiseFactory } from 'common/promises/promise-factory';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';

export type AsyncApplicationListner = (...eventArgs: any[]) => Promise<any>;
export type FireAndForgetApplicationListener = (...eventArgs: any[]) => void;

export type ApplicationListener = AsyncApplicationListner | FireAndForgetApplicationListener;

interface BrowserListener {
    (...eventArgs: any[]): any;
}

interface EventDetails {
    eventType: string;
    eventArgs: any[];
}

interface DeferredEventDetails extends EventDetails {
    deferredResolution: ExternalResolutionPromise;
    isStale: boolean;
}

// As of writing, Chromium maintains its own 5 minute event timeout and will tear down our
// service worker if this is exceeded, even if other work is outstanding. To avoid this, our
// own timeout MUST be shorter than Chromium's.
const EVENT_TIMEOUT_MS = 60 * 1000;

// Ideally, all of our ApplicationListeners would return a Promise whose lifetime encapsulates
// whether the listener's work is done yet. As of writing, some listeners are "fire and forget",
// and continue to do some async work after returning undefined. To ensure those listeners have
// time to do their work, the event manager adds this (arbitrary) delay into its response to the
// browser event.
const FIRE_AND_FORGET_EVENT_DELAY_MS = 30 * 1000;

// BrowserEventManager is to be used by a BrowserAdapter to ensure the browser does not determine
// that the service worker can be shut down due to events not responding within 5 minutes.
//
// It is responsible for acting as a mediator between browser-level events and application-level listeners:
//   * registering a handleEvent listener per eventType to respond to all browser-level events by:
//      * ensuring a response is sent to the browser within 4 minutes to prevent the 5-minute watchdog timeout
//      * delaying potential fire-and-forget responses for 2 minutes to give potential promises time to finish
//      * deferring any events without an associated application-level listener until one is registered
//   * registering application-level listeners to be called inside the handleEvent listener
//
// For more info on Chromium's Service Worker lifetime restrictions, see
// https://chromium.googlesource.com/chromium/src/+/refs/tags/103.0.5025.1/docs/security/service-worker-security-faq.md#do-service-workers-live-forever
export class BrowserEventManager {
    private deferredEvents: DeferredEventDetails[] = [];
    private eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};
    private eventsToBrowserListenersMapping: DictionaryStringTo<BrowserListener> = {};
    private readonly fireAndForgetEventDelayMs: number;

    constructor(
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
        isServiceWorker: boolean = false,
    ) {
        // The fire and forget delay is not necessary in the manifest v2 background page, so we
        // avoid using it there because it carries a high risk of accidentally breaking it while
        // we're still working on manifest v3 changes to eliminate fire and forget events entirely
        this.fireAndForgetEventDelayMs = isServiceWorker ? FIRE_AND_FORGET_EVENT_DELAY_MS : 0;
    }

    public addApplicationListener = (eventType: string, callback: ApplicationListener): void => {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            throw new Error(`Listener already registered for ${eventType}`);
        }
        if (!this.eventsToBrowserListenersMapping[eventType]) {
            throw new Error(`No browser listener registered for ${eventType}`);
        }
        this.eventsToApplicationListenersMapping[eventType] = callback;
        this.processDeferredEvents();
    };

    public addBrowserListener = (event: Events.Event<any>, eventType: string): void => {
        const eventListener = this.createBrowserListenerForEventType(eventType);
        event.addListener(eventListener);
        this.eventsToBrowserListenersMapping[eventType] = eventListener;
    };

    public removeListeners(event: Events.Event<any>, eventType: string) {
        this.removeBrowserListener(event, eventType);
        this.removeApplicationListener(eventType);
    }

    private createBrowserListenerForEventType: (eventType: string) => BrowserListener =
        (eventType: string) =>
        (...eventArgs: any[]) =>
            this.handleBrowserEvent(eventType, eventArgs);

    private handleBrowserEvent(eventType: string, eventArgs: any[]): Promise<any> {
        const responsePromise =
            this.tryProcessEvent(eventType, eventArgs) ?? this.deferEvent({ eventType, eventArgs });

        return responsePromise.catch(error => {
            this.logger.error(`Error while processing browser ${eventType} event: `, error);

            // We want to avoid rejecting the Promise we give back to the browser event handler
            // because doing so is liable to cause the browser to tear down our Service Worker
            // immediately, even if other events are in progress.
            return undefined;
        });
    }

    private tryProcessEvent(eventType: string, eventArgs: any[]): Promise<any> | null {
        const applicationListener = this.eventsToApplicationListenersMapping[eventType];
        return applicationListener
            ? this.forwardEventToApplicationListener(applicationListener, eventType, eventArgs)
            : null;
    }

    private processDeferredEvents(): void {
        const stillDeferred: DeferredEventDetails[] = [];
        for (const deferredEvent of this.deferredEvents) {
            if (deferredEvent.isStale) {
                // Stale events are ones that have already timed out before a corresponding
                // ApplicationListener was added. This is a pretty unexpected error case; we discard
                // stale events rather than allowing them to forward to a very late-attached
                // listener because we expect debugging just a timeout error log would be easier
                // than debugging whatever undefined behavior happens if our Service Worker gets
                // torn down an ApplicationListener is in progress.
                continue; // without persisting to stillDeferred
            }

            const maybeResponsePromise = this.tryProcessEvent(
                deferredEvent.eventType,
                deferredEvent.eventArgs,
            );

            if (maybeResponsePromise != null) {
                const { resolveHook, rejectHook } = deferredEvent.deferredResolution;
                maybeResponsePromise.then(resolveHook, rejectHook);
            } else {
                stillDeferred.push(deferredEvent);
            }
        }
        this.deferredEvents = stillDeferred;
    }

    private async forwardEventToApplicationListener(
        listener: ApplicationListener,
        eventType: string,
        eventArgs: any[],
    ): Promise<any> {
        let result: any;
        try {
            result = listener(...eventArgs);
        } catch (error) {
            this.logger.error(
                `Error thrown from ApplicationListener for browser ${eventType} event: `,
                error,
            );

            // Re-throwing here would be caught by handleBrowserEvent and turned into undefined
            // anyway; returning undefined here instead avoids a redundant error message
            return undefined;
        }
        if (isPromise(result)) {
            // Wrapping the ApplicationListener promise responses in a 4-minute timeout
            // prevents the service worker going idle before a response is sent
            const timeoutErrorContext = `[browser event listener: ${JSON.stringify({
                eventType,
                eventArgs,
            })}]`;
            return await this.promiseFactory.timeout(result, EVENT_TIMEOUT_MS, timeoutErrorContext);
        } else {
            if (result === undefined) {
                // It is possible that this is the result of a fire and forget listener
                // wrap promise resolution in 2-minute timeout to ensure it completes during service worker lifetime
                return await this.promiseFactory.delay(result, this.fireAndForgetEventDelayMs);
            } else {
                // This indicates a bug in an ApplicationListener; they should always either
                // return a Promise (to indicate that they are responsible for understanding
                // how long their response takes to process) or void/undefined (to indicate
                // that they are "fire and forget", and should trigger the above delay case).
                this.logger.error(
                    `Unexpected sync ApplicationListener for browser ${eventType} event: `,
                    listener,
                    eventArgs,
                );
                return result;
            }
        }
    }

    private deferEvent(eventDetails: EventDetails): Promise<any> {
        const deferredResolution = this.promiseFactory.externalResolutionPromise();
        const deferredEventDetails = {
            deferredResolution: deferredResolution,
            isStale: false,
            ...eventDetails,
        };
        this.deferredEvents.push(deferredEventDetails);

        const timeoutErrorContext = `[deferred browser event: ${JSON.stringify(eventDetails)}]`;

        // It's important that we ensure the promise settles even if a listener never registers
        // to prevent the Service Worker from being detected as stalled and torn down while other
        // work is still in progress.
        return this.promiseFactory
            .timeout(deferredResolution.promise, EVENT_TIMEOUT_MS, timeoutErrorContext)
            .finally(() => {
                deferredEventDetails.isStale = true;
            });
    }

    private removeBrowserListener(event: Events.Event<any>, eventType: string) {
        event.removeListener(this.eventsToBrowserListenersMapping[eventType]);
        delete this.eventsToBrowserListenersMapping[eventType];
    }

    private removeApplicationListener(eventType: string) {
        delete this.eventsToApplicationListenersMapping[eventType];
    }
}
