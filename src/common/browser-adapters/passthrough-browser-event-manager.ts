// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from 'types/common-types';
import { Events } from 'webextension-polyfill';
import { BrowserEventManager, ApplicationListener } from './browser-event-manager';

export class PassthroughBrowserEventManager implements BrowserEventManager {
    private eventsToApplicationListenersMapping: DictionaryStringTo<ApplicationListener> = {};

    public addApplicationListener(
        eventType: string,
        event: Events.Event<any>,
        callback: ApplicationListener,
    ): void {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            throw new Error(`Listener already registered for ${eventType}`);
        }

        this.eventsToApplicationListenersMapping[eventType] = callback;
        event.addListener(callback);
    }

    public removeListeners(eventType: string, event: Events.Event<any>) {
        if (this.eventsToApplicationListenersMapping[eventType]) {
            event.removeListener(this.eventsToApplicationListenersMapping[eventType]);
            delete this.eventsToApplicationListenersMapping[eventType];
        }
    }
}
