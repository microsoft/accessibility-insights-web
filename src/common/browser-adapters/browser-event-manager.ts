// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExternalResolutionPromise } from 'common/promises/promise-factory';
import { Events } from 'webextension-polyfill';

export type AsyncApplicationListner = (...eventArgs: any[]) => Promise<any>;
export type FireAndForgetApplicationListener = (...eventArgs: any[]) => void;

export type ApplicationListener = AsyncApplicationListner | FireAndForgetApplicationListener;

export interface BrowserListener {
    (...eventArgs: any[]): any;
}

export interface EventDetails {
    eventType: string;
    eventArgs: any[];
}

export interface DeferredEventDetails extends EventDetails {
    deferredResolution: ExternalResolutionPromise;
    isStale: boolean;
}

export interface BrowserEventManager {
    addApplicationListener(
        eventType: string,
        event: Events.Event<any>,
        callback: ApplicationListener,
    ): void;

    removeListeners(eventType: string, event: Events.Event<any>);
}
