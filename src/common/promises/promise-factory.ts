// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>;
type PollOptions = {
    pollIntervalInMilliseconds?: number;
    timeoutInMilliseconds?: number;
};
type PollPromise = (predicate: () => Promise<boolean>, options?: PollOptions) => Promise<void>;
type WaitForDurationPromise = (durationInMilliseconds: number) => Promise<void>;

export type PromiseFactory = {
    timeout: TimeoutPromise;
    poll: PollPromise;
    waitForDuration: WaitForDurationPromise;
};

const createTimeout: TimeoutPromise = async <T>(originalPromise: Promise<T>, delayInMilliseconds: number) => {
    const timeoutSentinelValue = {};
    const timeoutPromise = createWaitForDurationPromise(delayInMilliseconds).then(() => timeoutSentinelValue);

    const sentinelOrReturnValue = await Promise.race([originalPromise, timeoutPromise]);
    if (sentinelOrReturnValue === timeoutSentinelValue) {
        throw new Error(`Timed out after ${delayInMilliseconds} ms`);
    } else {
        return sentinelOrReturnValue as T;
    }
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

        await createWaitForDurationPromise(options.pollIntervalInMilliseconds);
    } while (!timedOut);
    throw new Error(`Timed out after polling for ${options.timeoutInMilliseconds} ms`);
};

const createWaitForDurationPromise: WaitForDurationPromise = async (durationInMilliseconds: number) => {
    // false positive
    // tslint:disable-next-line: no-string-based-set-timeout
    await new Promise(resolve => setTimeout(resolve, durationInMilliseconds));
};

export const createDefaultPromiseFactory = (): PromiseFactory => {
    return {
        timeout: createTimeout,
        poll: createPollPromise,
        waitForDuration: createWaitForDurationPromise,
    };
};
