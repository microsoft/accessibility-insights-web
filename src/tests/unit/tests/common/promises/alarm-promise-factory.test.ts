// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AlarmPromiseFactory,
    createAlarmPromiseFactory,
    TimeoutError,
} from 'common/promises/alarm-promise-factory';
import { AlarmUtilsStub } from 'tests/unit/stubs/alarm-utils-stub';
import { ChromeAlarmsAPMIMock } from 'tests/unit/mock-helpers/chrome-alarms-api-mock';
[];

describe(createAlarmPromiseFactory, () => {
    let mockAlarmsAPI: ChromeAlarmsAPMIMock;
    let testObject: AlarmPromiseFactory;
    let testTimeoutId = `timeout-promise-${Date.now()}`;

    describe('timeout', () => {
        beforeEach(() => {
            mockAlarmsAPI = new ChromeAlarmsAPMIMock();
            mockAlarmsAPI.setupAddListener(mockAlarmsAPI.createMockCallback().object); //verify addlistener is called
            mockAlarmsAPI.setupCreate(testTimeoutId, { when: 50 });
            mockAlarmsAPI.setupClear(testTimeoutId);
            const alarmUtils = new AlarmUtilsStub(mockAlarmsAPI);
            mockAlarmsAPI.setAlarmListener(alarmUtils.handleAlarm); //set the listener to the correct function
            testObject = createAlarmPromiseFactory(alarmUtils);
        });

        it("propogates an underlying Promise's resolve", async () => {
            const actual = 'the result';
            const resolving = Promise.resolve(actual);

            const result = testObject.timeout(resolving, 10);

            await expect(result).resolves.toEqual(actual);
        });

        it("propogates an underlying Promise's reject", async () => {
            const reason = 'rejecting!';
            const rejecting = testObject.timeout(Promise.reject(reason), 10);

            await expect(rejecting).rejects.toEqual(reason);
        });

        it('rejects with a TimeoutError on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowError(TimeoutError);
        });

        it('rejects with the pinned error message on timeout', async () => {
            const delay = 1;
            const timingOut = testObject.timeout(neverResolveAsync(), delay);

            await expect(timingOut).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Timed out after 1ms"`,
            );
        });

        function neverResolveAsync(): Promise<never> {
            return new Promise(() => {});
        }
    });
});
