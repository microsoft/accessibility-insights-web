// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { Logger } from 'common/logging/logger';
import { isPromise } from 'common/promises/is-promise';
import { PromiseFactory } from 'common/promises/promise-factory';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';
import {
    BrowserEventManager,
    DeferredEventDetails,
    ApplicationListener,
    BrowserListener,
    EventDetails,
} from './browser-event-manager';

// BackgroundBrowserEventManager is to be used by a BrowserAdapter to ensure the browser does not
// determine that the service worker can be shut down due to events not responding within 5 minutes.
//
// It is responsible for acting as a mediator between browser-level events and application-level listeners:
//   * registering a handleEvent listener per eventType to respond to all browser-level events by:
//      * ensuring a response is sent to the browser within 4 minutes to prevent the 5-minute watchdog timeout
//      * deferring any events without an associated application-level listener until one is registered
//   * registering application-level listeners to be called inside the handleEvent listener
//
// For more info on Chromium's Service Worker lifetime restrictions, see
// https://chromium.googlesource.com/chromium/src/+/refs/tags/103.0.5025.1/docs/security/service-worker-security-faq.md#do-service-workers-live-forever
export class BackgroundBrowserEventManager implements BrowserEventManager {
    private deferredEvents: DeferredEventDetails[] = [];
    private eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};
    private eventsToBrowserListenersMapping: DictionaryStringTo<BrowserListener> = {};

    constructor(
        private readonly promiseFactory: PromiseFactory,
        private readonly eventResponseFactory: EventResponseFactory,
        private readonly logger: Logger,
    ) {}

    public addApplicationListener = (
        eventType: string,
        event: Events.Event<any>,
        callback: ApplicationListener,
    ): void => {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            throw new Error(`Listener already registered for ${eventType}`);
        }

        if (
            !this.eventsToBrowserListenersMapping[eventType] ||
            !event.hasListener(this.eventsToBrowserListenersMapping[eventType])
        ) {
            throw new Error(`No browser listener was pre-registered for ${eventType}`);
        }

        this.eventsToApplicationListenersMapping[eventType] = callback;
        this.processDeferredEvents();
    };

    public preregisterBrowserListeners = (
        eventsByName: DictionaryStringTo<Events.Event<any>>,
    ): void => {
        for (const eventType in eventsByName) {
            const eventListener = this.createBrowserListenerForEventType(eventType);
            eventsByName[eventType].addListener(eventListener);
            this.eventsToBrowserListenersMapping[eventType] = eventListener;
        }
    };

    public removeListeners(eventType: string, event: Events.Event<any>) {
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
            return await this.eventResponseFactory.applyEventTimeout(result, timeoutErrorContext);
        } else {
            if (result !== undefined) {
                // This indicates a bug in an ApplicationListener; they should always either
                // return a Promise (to indicate that they are responsible for understanding
                // how long their response takes to process) or void/undefined (to indicate
                // that the response has already been processed synchronously)
                this.logger.error(
                    `Unexpected sync ApplicationListener for browser ${eventType} event: `,
                    listener,
                    eventArgs,
                );
            }
            return result;
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
        return this.eventResponseFactory
            .applyEventTimeout(deferredResolution.promise, timeoutErrorContext)
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
