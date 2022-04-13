// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';

type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>;

export class TimeoutError extends Error {}

export type AlarmPromiseFactory = {
    timeout: TimeoutPromise;
};

export const createAlarmPromiseFactory = (alarmUtils: AlarmUtils): AlarmPromiseFactory => {
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
