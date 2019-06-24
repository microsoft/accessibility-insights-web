// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TimeoutPromise = <T>(promise: Promise<T>, delay: number) => Promise<T>;

export type PromiseFactory = {
    timeout: TimeoutPromise;
};

const createTimeout: TimeoutPromise = <T>(promise: Promise<T>, delay: number) => {
    const timeout = new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(`Timed out ${delay} ms`);
        }, delay);
    });

    return Promise.race([promise, timeout]);
};

export const createDefaultPromiseFactory = (): PromiseFactory => {
    return {
        timeout: createTimeout,
    };
};
