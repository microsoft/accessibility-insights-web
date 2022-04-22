// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { ExternalResolutionPromise, PromiseFactory } from 'common/promises/promise-factory';
import { defer } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';
export interface ApplicationListener {
    (...args: any[]): any;
}

export interface EventDetails {
    eventType: string;
    eventArgs: any[];
}

export interface DeferredEventDetails extends EventDetails {
    deferredResolution: ExternalResolutionPromise;
}
export interface AdapterListener {
    (...eventArgs: any[]): any;
}

const TWO_MINUTES = 120000;
const FOUR_MINUTES = 2 * TWO_MINUTES;

// BrowserAdapterEventManager is to be used by a BrowserAdapter to ensure the browser does not
// determine that the service worker can be shut down due to events not responding within 5 minutes.
//
// It is responsible for acting as a mediator between browser-level events and application-level listeners:
//   * registering a handleEvent listener per eventType to respond to all browser-level events by:
//      * ensuring a response is sent to the browser within 4 minutes to prevent the 5-minute watchdog timeout
//      * delaying potential fire-and-forget responses for 2 minutes to give potential promises time to finish
//      * deferring any events without an associated application-level listener until one is registered
//   * registering application-level listeners to be called inside the handleEvent listener

export class BrowserAdapterEventManager {
    protected deferredEvents: DeferredEventDetails[] = [];
    protected eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};
    protected eventsToAdapterListenersMapping: DictionaryStringTo<AdapterListener> = {};
    protected handleEvent: (eventType: string) => AdapterListener =
        (eventType: string) =>
        (...eventArgs: any[]) => {
            const responsePromise =
                this.tryProcessEvent(eventType, eventArgs) ??
                this.deferEvent({ eventType, eventArgs });

            return responsePromise.catch(error => {
                this.logger.error(
                    `Error while processing browser ${eventType} event: ${JSON.stringify(error)}`,
                );

                // We want to avoid rejecting the Promise we give back to the browser event handler
                // because doing so is liable to cause the browser to tear down our Service Worker
                // immediately, even if other events are in progress.
                return undefined;
            });
        };

    constructor(private promiseFactory: PromiseFactory, private logger: Logger) {}

    public registerEventToApplicationListener = (
        eventType: string,
        callback: ApplicationListener,
    ): void => {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            throw new Error(`Listener already registered for ${eventType}`);
        }
        this.eventsToApplicationListenersMapping[eventType] = callback;
        this.processDeferredEvents();
    };

    public registerAdapterListenerForEvent = (
        event: Events.Event<any>,
        eventType: string,
    ): void => {
        const eventListener = this.handleEvent(eventType);
        event.addListener(eventListener);
        this.eventsToAdapterListenersMapping[eventType] = eventListener;
    };

    public tryProcessEvent(eventType: string, eventArgs: any[]): Promise<any> | null {
        const applicationListener = this.eventsToApplicationListenersMapping[eventType];
        return applicationListener
            ? this.forwardEventToApplicationListener(applicationListener, eventType, eventArgs)
            : null;
    }

    public removeListener(event: Events.Event<any>, eventType: string) {
        this.unregisterAdapterListener(event, eventType);
        this.unregisterApplicationListenerForEvent(eventType);
    }

    private processDeferredEvents(): void {
        const stillDeferred: DeferredEventDetails[] = [];
        for (const deferredEvent of this.deferredEvents) {
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
                `Error thrown from ApplicationListener for event type ${eventType}: `,
                error,
            );
            throw error;
        }
        if (!!result && typeof result.then === 'function') {
            // Wrapping the ApplicationListener promise responses in a 4-minute timeout
            // prevents the service worker going idle before a response is sent
            return await this.promiseFactory.timeout(result, FOUR_MINUTES);
        } else {
            if (result === undefined) {
                // It is possible that this is the result of a fire and forget listener
                // wrap promise resolution in 2-minute timeout to ensure it completes during service worker lifetime
                return await this.promiseFactory.delay(result, TWO_MINUTES);
            } else {
                // This indicates a bug in an ApplicationListener; they should always either
                // return a Promise (to indicate that they are responsible for understanding
                // how long their response takes to process) or void/undefined (to indicate
                // that they are "fire and forget", and should trigger the above delay case).
                this.logger.error(
                    `Unexpected sync ApplicationListener for event type ${eventType}: `,
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
            ...eventDetails,
        };
        this.deferredEvents.push(deferredEventDetails);

        // Settle the promise in four minutes in case a listener is never registered
        setTimeout(() => {
            // Note that this timeout will still run if the deferred event resolves and is no
            // longer present in the deferredEvents list
            this.deferredEvents = this.deferredEvents.filter(e => e !== deferredEventDetails);
            // This relies on the Promise behavior where a Promise which has already been
            // resolved/rejected ignores subsequent calls to its resolve/reject hooks
            deferredResolution.rejectHook('no listener registered within timeout');
        }, FOUR_MINUTES);

        return deferredResolution.promise;
    }

    private unregisterAdapterListener(event: Events.Event<any>, eventType: string) {
        event.removeListener(this.eventsToAdapterListenersMapping[eventType]);
        delete this.eventsToAdapterListenersMapping[eventType];
    }

    private unregisterApplicationListenerForEvent(eventType: string) {
        delete this.eventsToApplicationListenersMapping[eventType];
    }
}
