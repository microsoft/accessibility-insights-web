// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExternalResolutionPromise, PromiseFactory } from 'common/promises/promise-factory';
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

export class BrowserAdapterEventManager {
    protected deferredEvents: DeferredEventDetails[] = [];
    protected eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};
    protected eventsToAdapterListenersMapping: DictionaryStringTo<AdapterListener> = {};
    protected handleEvent: (eventType: string) => AdapterListener =
        (eventType: string) =>
        (...eventArgs: any[]) => {
            return (
                this.processEvent(eventType, eventArgs) ?? this.deferEvent({ eventType, eventArgs })
            );
        };

    constructor(private promiseFactory: PromiseFactory) {}

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

    public processEvent(eventType: string, eventArgs: any[]): Promise<any> | null {
        const applicationListener = this.eventsToApplicationListenersMapping[eventType];
        return applicationListener
            ? this.forwardEventToApplicationListener(applicationListener, eventArgs)
            : null;
    }

    public removeListener(event: Events.Event<any>, eventType: string) {
        this.unregisterAdapterListener(event, eventType);
        this.unregisterApplicationListenerForEvent(eventType);
    }

    private processDeferredEvents(): void {
        const stillDeferred: DeferredEventDetails[] = [];
        for (const deferredEvent of this.deferredEvents) {
            if (this.eventsToApplicationListenersMapping[deferredEvent.eventType]) {
                try {
                    this.processEvent(deferredEvent.eventType, deferredEvent.eventArgs);
                    deferredEvent.deferredResolution.resolveHook(true);
                } catch (error) {
                    console.error(error);
                    deferredEvent.deferredResolution.rejectHook();
                }
            } else {
                stillDeferred.push(deferredEvent);
            }
        }
        this.deferredEvents = stillDeferred;
    }

    private forwardEventToApplicationListener(
        listener: ApplicationListener,
        eventArgs: any[],
    ): Promise<any> {
        let result: any;
        try {
            result = listener(...eventArgs);
        } catch (error) {
            console.error('Error thrown in application listener: ', error);
            result = error;
        }
        if (!!result && typeof result.then === 'function') {
            //wrapping application listener promise responses in a 4-minute promise resolution
            //prevents the service worker going idle before a response is sent
            return this.promiseFactory.delay(result, FOUR_MINUTES);
        } else {
            if (result === undefined) {
                // it is possible that this is the result of a fire and forget listener
                // wrap promise resolution in 2-minute timeout to ensure it completes during service worker lifetime
                return this.promiseFactory.delay(result, TWO_MINUTES);
            } else {
                //this is an odd case we should be aware of.
                //if triggered, update listener to return a Promise with the result
                console.error(
                    `Application listener returned a non-promise result`,
                    listener,
                    eventArgs,
                );
                return Promise.resolve(result);
            }
        }
    }

    private deferEvent(eventDetails: EventDetails): Promise<any> {
        const deferredResolution = this.promiseFactory.externalResolutionPromise();

        this.deferredEvents.push({
            deferredResolution: deferredResolution,
            ...eventDetails,
        });
        //resolve the promise in four minutes in case a listener is never registered
        setTimeout(() => {
            deferredResolution.resolveHook('no listener registered');
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
