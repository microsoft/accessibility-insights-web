// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createAlarmPromiseFactory,
    createDefaultPromiseFactory,
    TimeoutError,
} from 'common/promises/promise-factory';
import { ChromeAlarmsAPMIMock } from 'tests/unit/mock-helpers/chrome-alarms-api-mock';
import { AlarmUtilsStub } from 'tests/unit/stubs/alarm-utils-stub';

function neverResolveAsync(): Promise<never> {
    return new Promise(() => {});
}

describe(`promiseFactory`, () => {
    const testTimeoutId = `timeout-promise-${Date.now()}`;
    const mockAlarmsAPI = new ChromeAlarmsAPMIMock();
    mockAlarmsAPI.setupAddListener(mockAlarmsAPI.createMockCallback().object); //verify addlistener is called
    mockAlarmsAPI.setupCreate(testTimeoutId, 50);
    mockAlarmsAPI.setupClear(testTimeoutId);
    const alarmUtils = new AlarmUtilsStub(mockAlarmsAPI);
    mockAlarmsAPI.setAlarmListener(alarmUtils.handleAlarm); //set the listener to the correct function
    const testAlarmObject = createAlarmPromiseFactory(alarmUtils);
    const testDefaultObject = createDefaultPromiseFactory();
    describe('timeout', () => {
        it.each`
            testObject           | promiseFactoryType
            ${testDefaultObject}
            ${testAlarmObject}
        `(
            "$promiseFactoryType propogates an underlying Promise's resolve",
            async ({ testObject }) => {
                const actual = 'the result';
                const resolving = Promise.resolve(actual);

                const result = testObject.timeout(resolving, 10);

                await expect(result).resolves.toEqual(actual);
            },
        );

        it.each`
            testObject           | promiseFactoryType
            ${testDefaultObject}
            ${testAlarmObject}
        `(
            "$promiseFactoryType propogates an underlying Promise's reject",
            async ({ testObject }) => {
                const reason = 'rejecting!';
                const rejecting = testObject.timeout(Promise.reject(reason), 10);

                await expect(rejecting).rejects.toEqual(reason);
            },
        );

        it.each`
            testObject           | promiseFactoryType
            ${testDefaultObject}
            ${testAlarmObject}
        `('$promiseFactoryType rejects with a TimeoutError on timeout', async ({ testObject }) => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowError(TimeoutError);
        });

        it.each`
            testObject           | promiseFactoryType
            ${testDefaultObject}
            ${testAlarmObject}
        `(
            '$promiseFactoryType rejects with the pinned error message on timeout',
            async ({ testObject }) => {
                const delay = 1;
                const timingOut = testObject.timeout(neverResolveAsync(), delay);

                await expect(timingOut).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Timed out after 1ms"`,
                );
            },
        );
    });
});
