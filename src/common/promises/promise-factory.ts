// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';

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

export const createAlarmPromiseFactory = (alarmUtils: AlarmUtils): PromiseFactory => {
    return {
        timeout: <T>(promise: Promise<T>, delayInMilliseconds: number) => {
            const timeout = new Promise<T>((resolve, reject) => {
                const timeoutId = `timeout-promise-${Date.now()}`;
                alarmUtils.createAlarmWithCallback(timeoutId, delayInMilliseconds, () => {
                    reject(new TimeoutError(`Timed out after ${delayInMilliseconds}ms`));
                    alarmUtils.clearAlarm(timeoutId);
                });
            });

            return Promise.race([promise, timeout]);
        },
    };
};
