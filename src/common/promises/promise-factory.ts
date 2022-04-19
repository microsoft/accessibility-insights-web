// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>;

export type ExternalResolutionPromise = {
    promise: Promise<any>;
    resolveHook: (value: unknown) => any;
    rejectHook: (reason?: any) => any;
};

export class TimeoutError extends Error {}

export type PromiseFactory = {
    timeout: TimeoutPromise;
    externalResolutionPromise: () => ExternalResolutionPromise;
};

const createTimeout: TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => {
    const timeout = new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(new TimeoutError(`Timed out after ${delayInMilliseconds}ms`));
        }, delayInMilliseconds);
    });

    return Promise.race([promise, timeout]);
};

const createPromiseForExternalResolution = (): ExternalResolutionPromise => {
    let resolveHook: (value: unknown) => any = (value: unknown) => value;
    let rejectHook: (reason?: any) => any = (reason?: any) => reason;

    const promise = new Promise((resolve, reject) => {
        resolveHook = resolve;
        rejectHook = reject;
    });

    return {
        promise,
        resolveHook,
        rejectHook,
    };
};

export const createDefaultPromiseFactory = (): PromiseFactory => {
    return {
        timeout: createTimeout,
        externalResolutionPromise: createPromiseForExternalResolution,
    };
};
