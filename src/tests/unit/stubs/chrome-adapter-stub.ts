// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class PortDisconnectStub implements chrome.runtime.PortDisconnectEvent {
    public listeners: any[];
    public callbackForDisconnect: any[];

    constructor() {
        this.listeners = [];
        this.callbackForDisconnect = [];
    }

    public addListener(callback: any): void {
        this.listeners.push(callback);
        this.callbackForDisconnect.push(callback);
    }

    public getRules(ruleIdentifiers: any, callback?: any): void {
        throw new Error('Method not implemented.');
    }

    public hasListener(callback: (port: chrome.runtime.Port) => void): boolean {
        return Helpers.arrayHasCallback(this.listeners, callback);
    }

    public removeRules(ruleIdentifiers?: any, callback?: any): void {
        throw new Error('Method not implemented.');
    }

    public addRules(
        rules: chrome.events.Rule[],
        callback?: (rules: chrome.events.Rule[]) => void,
    ): void {
        throw new Error('Method not implemented.');
    }

    public removeListener(callback: (port: chrome.runtime.Port) => void): void {
        this.listeners = Helpers.removeCallbackFromArray(
            this.listeners,
            callback,
        );
    }

    public hasListeners(): boolean {
        return this.listeners.length > 0;
    }

    public disconnect(port): void {
        this.listeners.forEach(listener => {
            listener(port);
        });
    }
}

export class PortOnMessageStub implements chrome.runtime.PortMessageEvent {
    public listeners: any[];

    constructor() {
        this.listeners = [];
    }

    public addListener(
        callback: (message: Object, port: chrome.runtime.Port) => void,
    ): void {
        this.listeners.push(callback);
    }

    public getRules(ruleIdentifiers: any, callback?: any): void {
        throw new Error('Method not implemented.');
    }

    public hasListener(
        callback: (message: Object, port: chrome.runtime.Port) => void,
    ): boolean {
        return Helpers.arrayHasCallback(this.listeners, callback);
    }

    public removeRules(ruleIdentifiers?: any, callback?: any): void {
        throw new Error('Method not implemented.');
    }

    public addRules(
        rules: chrome.events.Rule[],
        callback?: (rules: chrome.events.Rule[]) => void,
    ): void {
        throw new Error('Method not implemented.');
    }

    public removeListener(
        callback: (message: Object, port: chrome.runtime.Port) => void,
    ): void {
        this.listeners = Helpers.removeCallbackFromArray(
            this.listeners,
            callback,
        );
    }

    public hasListeners(): boolean {
        return this.listeners.length > 0;
    }

    public sendMessage(message: any): void {
        this.listeners.forEach(listener => {
            console.log(this.listeners);
            listener(message);
        });
    }
}

namespace Helpers {
    export function arrayHasCallback(
        array: Function[],
        callback: Function,
    ): boolean {
        for (let i = 0; i < array.length; i++) {
            const currentCallback = array[i];

            if (currentCallback.toString() === callback.toString()) {
                return true;
            }
        }

        return false;
    }

    export function removeCallbackFromArray(
        array: Function[],
        callback: Function,
    ): Function[] {
        return array.filter(item => {
            return item.toString() !== callback.toString();
        });
    }
}
