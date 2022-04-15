// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetTimeoutManager } from 'background/set-timeout-manager';
import { PromiseFactory } from 'common/promises/promise-factory';
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';

export interface ApplicationListener {
    (...args: any[]): any;
}

export interface EventDetails {
    eventType: string;
    eventArgs: any[];
}

export interface AdapterListener {
    (eventType: string): (eventArgs: any[]) => any;
}

export class BrowserAdapterEventManager {
    protected deferredEvents: EventDetails[] = [];
    protected eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener[]> = {};
    protected adapterListener: AdapterListener =
        (eventType: string) =>
        (...eventArgs: any[]) => {
            this.processEvent(eventType, eventArgs);
        };
    constructor(
        private promiseFactory?: PromiseFactory,
        private setTimeoutManager?: SetTimeoutManager,
    ) {}

    public registerEventToApplicationListener = (
        eventType: string,
        callback: ApplicationListener,
    ): void => {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            this.eventsToApplicationListenersMapping[eventType].push(callback);
        } else {
            this.eventsToApplicationListenersMapping[eventType] = [callback];
        }
        this.processDeferredEvents();
    };

    public registerAdapterListenerForEvent = (
        event: Events.Event<any>,
        eventType: string,
    ): void => {
        event.addListener(this.adapterListener(eventType));
    };

    private processDeferredEvents(): void {
        this.deferredEvents = this.deferredEvents.filter(
            event => this.processEvent(event.eventType, event.eventArgs, true) === false,
        );
    }

    private async forwardEventToApplicationListener(
        listener: ApplicationListener,
        eventArgs: any[],
    ): Promise<any> {
        const result = listener(...eventArgs);
        if (!!result && typeof result.then === 'function') {
            if (this.promiseFactory) {
                //wrapping application listener promise responses in a 4-minute promise race
                //prevents the service worker going idle before a response is sent
                await this.promiseFactory.timeout(result, 240000);
            }
        } else {
            // it is possible that this is the result of a fire and forget listener
            // wrap in 2-minute timeout to ensure it completes during service worker lifetime
            if (this.setTimeoutManager) {
                return this.setTimeoutManager.setTimeout(
                    () => Promise.resolve(result),
                    120000,
                    `wrapper-timeout-${Date.now()}`,
                );
            }
        }
        return result;
    }

    private unregisterAdapterListener(event: Events.Event<any>, eventType: string) {
        event.removeListener(this.adapterListener(eventType));
    }

    private unregisterApplicationListenerForEvent(
        eventType: string,
        listener: ApplicationListener,
    ) {
        const allListeners = this.eventsToApplicationListenersMapping[eventType];
        const applicationListenerIndex = allListeners.findIndex(listener);
        if (applicationListenerIndex < 0) {
            console.error('no application listeners found for ', eventType);
        } else {
            if (allListeners.length === 1) {
                delete this.eventsToApplicationListenersMapping[eventType];
            } else {
                this.eventsToApplicationListenersMapping[eventType] =
                    allListeners.splice(applicationListenerIndex);
            }
        }
    }

    public removeListener(
        event: Events.Event<any>,
        eventType: string,
        listener: ApplicationListener,
    ) {
        this.unregisterAdapterListener(event, eventType);
        this.unregisterApplicationListenerForEvent(eventType, listener);
    }

    public processEvent(eventType: string, eventArgs: any[], isDeferred?: boolean): boolean {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            this.eventsToApplicationListenersMapping[eventType].forEach(applicationListener => {
                this.forwardEventToApplicationListener(applicationListener, eventArgs);
            });
            return true;
        } else {
            if (!isDeferred) {
                const eventDetails: EventDetails = {
                    eventType,
                    eventArgs,
                };
                this.deferredEvents.push(eventDetails);
            }
            return false;
        }
    }
}
