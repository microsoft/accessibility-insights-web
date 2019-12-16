// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>;
type PollOptions = {
    pollIntervalInMilliseconds?: number;
    timeoutInMilliseconds?: number;
};
type PollPromise = (predicate: () => Promise<boolean>, options?: PollOptions) => Promise<void>;

export type PromiseFactory = {
    timeout: TimeoutPromise;
    poll: PollPromise;
};

const createTimeout: TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => {
    const timeout = new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(new Error(`Timed out after ${delayInMilliseconds} ms`));
        }, delayInMilliseconds);
    });

    return Promise.race([promise, timeout]);
};

const createPollPromise: PollPromise = async (predicate: () => Promise<boolean>, options?: PollOptions) => {
    options = {
        pollIntervalInMilliseconds: 50,
        timeoutInMilliseconds: 5000,
        ...options,
    };

    let timedOut = false;
    const timeoutHandle = setTimeout(() => (timedOut = true), options.timeoutInMilliseconds);
    do {
        if (await predicate()) {
            clearTimeout(timeoutHandle);
            return;
        }

        if (timedOut) {
            break;
        }

        // false positive
        // tslint:disable-next-line: no-string-based-set-timeout
        await new Promise(resolve => setTimeout(resolve, options.pollIntervalInMilliseconds));
    } while (!timedOut);
    throw new Error(`Timed out after polling for ${options.timeoutInMilliseconds} ms`);
};

export const createDefaultPromiseFactory = (): PromiseFactory => {
    return {
        timeout: createTimeout,
        poll: createPollPromise,
    };
};
