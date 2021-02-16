// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import { FocusActions } from 'electron/flux/action/focus-actions';
import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusControllerFactory } from 'electron/platform/android/device-focus-controller-factory';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('DeviceFocusControllerFactory tests', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let focusActionsMock: IMock<FocusActions>;
    let loggerMock: IMock<Logger>;
    let testSubject: DeviceFocusControllerFactory;

    const focusCommandSenderMock: IMock<DeviceFocusCommandSender> = Mock.ofType<DeviceFocusCommandSender>(
        undefined,
        MockBehavior.Strict,
    );

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>(
            undefined,
            MockBehavior.Strict,
        );
        focusActionsMock = Mock.ofType<FocusActions>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        testSubject = new DeviceFocusControllerFactory(
            focusCommandSenderMock.object,
            telemetryEventHandlerMock.object,
            focusActionsMock.object,
            loggerMock.object,
        );
    });

    it('getDeviceFocusController returns correct type', () => {
        const adbWrapperMock: IMock<AdbWrapper> = Mock.ofType<AdbWrapper>(
            undefined,
            MockBehavior.Strict,
        );

        const deviceFocusController = testSubject.getDeviceFocusController(adbWrapperMock.object);

        expect(deviceFocusController).toBeInstanceOf(DeviceFocusController);
    });
});
