// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AlarmUtils } from 'background/alarm-utils';
import {
    AlarmTimeoutFactory,
    TimeoutFactory,
    WindowTimeoutFactory,
} from 'common/timeouts/timeout-factory';
import { WindowUtils } from 'common/window-utils';
import { IMock, Mock, Times } from 'typemoq';

describe(`TimeoutFactory`, () => {
    const testTimeoutId = `timeout-promise-${Date.now()}`;
    const delayInMs = 50;
    const callback = () => true;

    describe(`WindowTimeoutFactory`, () => {
        let mockWindowUtils: IMock<WindowUtils>;
        let testWindowTimeoutFactory: TimeoutFactory;
        beforeEach(() => {
            mockWindowUtils = Mock.ofType<WindowUtils>();
            testWindowTimeoutFactory = new WindowTimeoutFactory(mockWindowUtils.object);
            mockWindowUtils.setup(a => a.setTimeout(callback, delayInMs)).verifiable(Times.once());
        });

        it('createTimeout calls windowUtils.setTimeout', () => {
            testWindowTimeoutFactory.createTimeout(callback, delayInMs);
            mockWindowUtils.verifyAll();
        });
        it('createTimeout does not use name if provided', () => {
            testWindowTimeoutFactory.createTimeout(callback, delayInMs);
            mockWindowUtils.verifyAll();
        });
    });

    describe(`AlarmTimeoutFactory`, () => {
        let mockAlarmUtils: IMock<AlarmUtils>;
        let testAlarmTimeoutFactory: TimeoutFactory;
        beforeEach(() => {
            mockAlarmUtils = Mock.ofType<AlarmUtils>();
            testAlarmTimeoutFactory = new AlarmTimeoutFactory(mockAlarmUtils.object);
            mockAlarmUtils
                .setup(a => a.createAlarmWithCallback(testTimeoutId, delayInMs, callback))
                .verifiable(Times.once());
        });
        it('createTimeout calls alarmUtils.createAlarmWithCallback', () => {
            testAlarmTimeoutFactory.createTimeout(callback, delayInMs, testTimeoutId);
            mockAlarmUtils.verifyAll();
        });
    });
});
