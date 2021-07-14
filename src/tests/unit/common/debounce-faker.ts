// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import type { DebouncedFunc } from 'lodash';

export type DebounceCallRecord<T extends (...args: any[]) => any> = {
    args: Parameters<T>;
};

// Intended for use in tests of components that rely on lodash.debounce.
//
// A test can set up a new DebounceFaker() instance and pass theDebounceFaker.debounce in place
// of lodash.debounce to a dependency, and then use theDebounceFaker's properties to track
// details of the call to debounce and/or invoke theDebounceFaker's flush/cancel methods to control
// the timings of when debouncing triggers.
//
// Note that the faked version of debounce will *not* automatically invoke its callback after
// the usual delay; a test must *explicitly* invoke theDebounceFaker.flush() when it is ready
// for any debounced calls to run.
export class DebounceFaker<T extends (...args: any[]) => any> {
    public used = false;
    public cancelled = false;
    public pendingCall: DebounceCallRecord<T> | null = null;
    public delay: number;
    public callback: T;

    public cancel = () => {
        this.cancelled = true;
        this.pendingCall = null;
    };
    public flush = (): ReturnType<T> | undefined => {
        if (this.pendingCall != null) {
            const args = this.pendingCall.args;
            this.pendingCall = null;
            return this.callback(...args);
        }
        return undefined;
    };
    public debounce = (callback: T, delay: number, options?: {}): DebouncedFunc<T> => {
        if (this.used) {
            throw new Error('A given DebounceFaker can only be used once');
        }
        if (options != null) {
            throw new Error('Custom debounce options not implemented');
        }
        this.used = true;
        this.delay = delay;
        this.callback = callback;

        const output = (...args: Parameters<T>): ReturnType<T> | undefined => {
            if (!this.cancelled) {
                this.pendingCall = { args };
            }
            return undefined;
        };
        output.cancel = this.cancel;
        output.flush = this.flush;
        return output;
    };
}
