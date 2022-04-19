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
    (eventType: string): (eventArgs: any[]) => any;
}

const TWO_MINUTES = 120000;
const FOUR_MINUTES = 2 * TWO_MINUTES;

export class BrowserAdapterEventManager {
    protected deferredEvents: DeferredEventDetails[] = [];
    protected eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};
    protected adapterListener: AdapterListener =
        (eventType: string) =>
        (...eventArgs: any[]) => {
            this.processEvent(eventType, eventArgs);
        };

    constructor(private promiseFactory: PromiseFactory) {}

    public registerEventToApplicationListener = (
        eventType: string,
        callback: ApplicationListener,
    ): void => {
        this.eventsToApplicationListenersMapping[eventType] = callback;
        this.processDeferredEvents();
    };

    public registerAdapterListenerForEvent = (
        event: Events.Event<any>,
        eventType: string,
    ): void => {
        event.addListener(this.adapterListener(eventType));
    };

    private processDeferredEvents(): void {
        const stillDeferred: DeferredEventDetails[] = [];
        this.deferredEvents.forEach(deferredEvent => {
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
        });
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
            throw error;
        }
        if (!!result && typeof result.then === 'function') {
            //wrapping application listener promise responses in a 4-minute promise race
            //prevents the service worker going idle before a response is sent
            return this.promiseFactory.timeout(result, FOUR_MINUTES);
        } else {
            // it is possible that this is the result of a fire and forget listener
            // wrap in 2-minute timeout to ensure it completes during service worker lifetime
            globalThis.setTimeout(() => {
                Promise.resolve(result);
            }, TWO_MINUTES);
            return Promise.resolve(result);
        }
    }

    private deferEvent(eventDetails: EventDetails): Promise<any> {
        const deferredResolution = this.promiseFactory.externalResolutionPromise();

        this.deferredEvents.push({
            deferredResolution: deferredResolution,
            ...eventDetails,
        });

        return deferredResolution.promise;
    }

    public processEvent(eventType: string, eventArgs: any[]): Promise<any> {
        const applicationListener = this.eventsToApplicationListenersMapping[eventType];
        if (applicationListener) {
            return this.forwardEventToApplicationListener(applicationListener, eventArgs);
        } else {
            const alreadyDeferred = this.deferredEvents.find(
                eventDetails =>
                    eventDetails.eventType === eventType && eventDetails.eventArgs === eventArgs,
            );
            if (alreadyDeferred) {
                return alreadyDeferred.deferredResolution.promise;
            } else {
                return this.deferEvent({
                    eventType,
                    eventArgs,
                });
            }
        }
    }

    private unregisterAdapterListener(event: Events.Event<any>, eventType: string) {
        event.removeListener(this.adapterListener(eventType));
    }

    private unregisterApplicationListenerForEvent(eventType: string) {
        this.eventsToApplicationListenersMapping[eventType] &&
            delete this.eventsToApplicationListenersMapping[eventType];
    }

    public removeListener(event: Events.Event<any>, eventType: string) {
        this.unregisterAdapterListener(event, eventType);
        this.unregisterApplicationListenerForEvent(eventType);
    }
}
