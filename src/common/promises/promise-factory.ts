// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>;

export class TimeoutError extends Error {}

export type PromiseFactory = {
    timeout: TimeoutPromise;
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

export const createDefaultPromiseFactory = (): PromiseFactory => {
    return {
        timeout: createTimeout,
    };
};
