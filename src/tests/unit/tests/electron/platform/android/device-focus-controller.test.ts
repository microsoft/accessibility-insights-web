// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
import { FocusActions } from 'electron/flux/action/focus-actions';
import { AdbWrapper, KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusController tests', () => {
    const deviceId: string = 'some device';
    const port: number = 23456;

    let adbWrapperMock: IMock<AdbWrapper>;
    let commandSenderMock: IMock<DeviceFocusCommandSender>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let focusActionsMock: IMock<FocusActions>;
    let loggerMock: IMock<Logger>;
    let testSubject: DeviceFocusController;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        commandSenderMock = Mock.ofType<DeviceFocusCommandSender>(undefined, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>(
            undefined,
            MockBehavior.Strict,
        );
        focusActionsMock = Mock.ofType<FocusActions>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        testSubject = new DeviceFocusController(
            adbWrapperMock.object,
            commandSenderMock.object,
            telemetryEventHandlerMock.object,
            focusActionsMock.object,
            loggerMock.object,
        );
        testSubject.setDeviceId(deviceId);
        testSubject.setPort(port);
    });

    it('EnableFocusTracking sends correct command and telemetry', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Enable))
            .verifiable(Times.once());
        telemetryEventHandlerMock
            .setup(m => m.publishTelemetry(DEVICE_FOCUS_ENABLE, {}))
            .verifiable(Times.once());

        await testSubject.EnableFocusTracking();

        commandSenderMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('DisableFocusTracking sends correct command and telemetry', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Disable))
            .verifiable(Times.once());
        telemetryEventHandlerMock
            .setup(m => m.publishTelemetry(DEVICE_FOCUS_DISABLE, {}))
            .verifiable(Times.once());

        await testSubject.DisableFocusTracking();

        commandSenderMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('ResetFocusTracking sends correct command and telemetry', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Reset))
            .verifiable(Times.once());
        telemetryEventHandlerMock
            .setup(m => m.publishTelemetry(DEVICE_FOCUS_RESET, {}))
            .verifiable(Times.once());

        await testSubject.ResetFocusTracking();

        commandSenderMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendUpKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Up);

        await testSubject.SendUpKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendDownKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Down))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Down);

        await testSubject.SendDownKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendLeftKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Left))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Left);

        await testSubject.SendLeftKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendRightKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Right))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Right);

        await testSubject.SendRightKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendEnterKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Enter))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Enter);

        await testSubject.SendEnterKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    it('SendTabKey sends correct command and telemetry', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Tab))
            .verifiable(Times.once());
        setTelemetryMockForKeyEvent(KeyEventCode.Tab);

        await testSubject.SendTabKey();

        adbWrapperMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    function setTelemetryMockForKeyEvent(keyEventCode: KeyEventCode): void {
        telemetryEventHandlerMock
            .setup(m =>
                m.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
                    telemetry: {
                        keyEventCode,
                    },
                }),
            )
            .verifiable(Times.once());
    }
});
