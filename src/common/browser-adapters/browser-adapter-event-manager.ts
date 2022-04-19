// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PromiseFactory } from 'common/promises/promise-factory';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';
export interface ApplicationListener {
    (...args: any[]): any;
}

export interface EventDetails {
    eventType: string;
    eventArgs: any[];
    resolveDeferred?: (eventDetails: EventDetails) => any;
}

export interface AdapterListener {
    (eventType: string): (eventArgs: any[]) => any;
}

const TWO_MINUTES = 120000;
const FOUR_MINUTES = 2 * TWO_MINUTES;

export class BrowserAdapterEventManager {
    protected deferredEvents: EventDetails[] = [];
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
        let stillDeferred: EventDetails[] = [];
        this.deferredEvents.forEach(deferredEvent => {
            if (this.eventsToApplicationListenersMapping[deferredEvent.eventType]) {
                deferredEvent.resolveDeferred(deferredEvent);
            } else {
                stillDeferred.push(deferredEvent);
            }
        });
        this.deferredEvents = stillDeferred;
    }

    private async forwardEventToApplicationListener(
        listener: ApplicationListener,
        eventArgs: any[],
    ): Promise<any> {
        let result = undefined;
        try {
            result = listener(...eventArgs);
        } catch (error) {
            console.error('Error thrown in application listener: ', error);
        }
        if (!!result && typeof result.then === 'function') {
            //wrapping application listener promise responses in a 4-minute promise race
            //prevents the service worker going idle before a response is sent
            return await this.promiseFactory.timeout(result, FOUR_MINUTES);
        } else {
            // it is possible that this is the result of a fire and forget listener
            // wrap in 2-minute timeout to ensure it completes during service worker lifetime
            return globalThis.setTimeout(() => Promise.resolve(result), TWO_MINUTES)
        }
    }

    private resolveDeferredEvent =
        (resolve: (value: unknown) => any, reject: (value: unknown) => any) =>
        (eventDetails: EventDetails): any => {
            return this.processEvent(eventDetails.eventType, eventDetails.eventArgs)
                .then(result => {
                    return resolve(result);
                })
                .catch(error => {
                    return reject(error);
                });
        };

    private deferEvent(eventDetails: EventDetails): Promise<any> {
        let resolve: (value: unknown) => any, reject: (reason?: any) => any;

        const deferredPromise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        this.deferredEvents.push({
            resolveDeferred: this.resolveDeferredEvent(resolve, reject),
            ...eventDetails,
        });
        return deferredPromise;
    }

    public processEvent(eventType: string, eventArgs: any[]): Promise<any> {
        const applicationListener = this.eventsToApplicationListenersMapping[eventType];
        if (applicationListener) {
            return this.forwardEventToApplicationListener(applicationListener, eventArgs);
        } else {
            if (
                this.deferredEvents.find(
                    eventDetails =>
                        eventDetails.eventType === eventType &&
                        eventDetails.eventArgs === eventArgs,
                )
            ) {
                //noop, don't defer twice
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
