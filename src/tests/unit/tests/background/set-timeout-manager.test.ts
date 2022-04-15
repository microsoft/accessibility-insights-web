// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AlarmUtils } from 'background/alarm-utils';
import { SetTimeoutManager } from 'background/set-timeout-manager';
import { WindowUtils } from 'common/window-utils';
import { IMock, Mock, Times } from 'typemoq';

describe(`setTimeout`, () => {
    const testTimeoutId = `timeout-promise-${Date.now()}`;
    const delayInMs = 50;
    const callback = () => true;

    describe('SetTimeoutManager', () => {
        describe('with alarmUtils', () => {
            it('setTimeout calls alarmUtils.createAlarmWithCallback', () => {
                const mockAlarmUtils: IMock<AlarmUtils> = Mock.ofType<AlarmUtils>();
                mockAlarmUtils
                    .setup(a => a.createAlarmWithCallback(testTimeoutId, delayInMs, callback))
                    .verifiable(Times.once());
                const testAlarmTimeoutManager = new SetTimeoutManager({
                    alarmUtils: mockAlarmUtils.object,
                });
                testAlarmTimeoutManager.setTimeout(callback, delayInMs, testTimeoutId);
                mockAlarmUtils.verifyAll();
            });

            it('setTimeout logs an error if name is not provided', () => {
                console.error = jest.fn();
                const mockAlarmUtils: IMock<AlarmUtils> = Mock.ofType<AlarmUtils>();
                mockAlarmUtils
                    .setup(a => a.createAlarmWithCallback(testTimeoutId, delayInMs, callback))
                    .verifiable(Times.never());
                const testAlarmTimeoutManager = new SetTimeoutManager({
                    alarmUtils: mockAlarmUtils.object,
                });
                testAlarmTimeoutManager.setTimeout(callback, delayInMs);
                mockAlarmUtils.verifyAll();
                expect(console.error).toHaveBeenCalled();
            });
        });
        describe('with windowUtils', () => {
            it('setTimeout calls windowUtils.setTimeout', () => {
                const mockWindowUtils: IMock<WindowUtils> = Mock.ofType<WindowUtils>();
                const testWindowTimeoutManager = new SetTimeoutManager({
                    windowUtils: mockWindowUtils.object,
                });
                mockWindowUtils
                    .setup(a => a.setTimeout(callback, delayInMs))
                    .verifiable(Times.once());

                testWindowTimeoutManager.setTimeout(callback, delayInMs);
                mockWindowUtils.verifyAll();
            });
        });
        describe('with empty utils', () => {
            it('setTimeout logs an error if both alarmUtils and windowUtils are empty', () => {
                console.error = jest.fn();
                const testWindowTimeoutManager = new SetTimeoutManager({});
                testWindowTimeoutManager.setTimeout(callback, delayInMs);
                expect(console.error).toHaveBeenCalled();
            });
        });
    });
});
