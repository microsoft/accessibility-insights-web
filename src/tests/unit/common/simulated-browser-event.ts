// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import type * as browser from 'webextension-polyfill';

// This is a testing browser Event which can be triggered manually using invoke().
//
// Supporting only a single listener is to simplify the invoke() interface; it returns the single
// listener's return value directly.
export class SimulatedBrowserEvent<T extends (...args: any[]) => any>
    implements browser.Events.Event<T>
{
    private listener: null | T = null;
    addListener(callback: T, ...params: any[]): void {
        if (this.listener !== null) {
            throw new Error('Invalid second addListener call');
        }
        this.listener = callback;
    }
    hasListener(callback: T): boolean {
        return this.listener === callback;
    }
    hasListeners(): boolean {
        return this.listener !== null;
    }
    removeListener(callback: T): void {
        if (this.listener !== callback) {
            throw new Error('Invalid removeListener call');
        }
        this.listener = null;
    }
    invoke(...params: Parameters<T>): ReturnType<T> {
        if (this.listener === null) {
            throw new Error('Invalid listener');
        }
        return this.listener(...params);
    }
}
