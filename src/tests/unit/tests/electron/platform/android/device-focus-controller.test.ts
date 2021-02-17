// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_ERROR,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { AdbWrapper, KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusController tests', () => {
    const deviceId: string = 'some device';
    const port: number = 23456;

    let adbWrapperMock: IMock<AdbWrapper>;
    let commandSenderMock: IMock<DeviceFocusCommandSender>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let loggerMock: IMock<Logger>;
    let statusDisconnectedMock: IMock<Action<void>>;
    let statusConnectedMock: IMock<Action<void>>;
    let testSubject: DeviceFocusController;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        commandSenderMock = Mock.ofType<DeviceFocusCommandSender>(undefined, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>(
            undefined,
            MockBehavior.Strict,
        );
        deviceConnectionActionsMock = Mock.ofType<DeviceConnectionActions>(
            undefined,
            MockBehavior.Strict,
        );
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        statusDisconnectedMock = Mock.ofType<Action<void>>();
        statusConnectedMock = Mock.ofType<Action<void>>();
        testSubject = new DeviceFocusController(
            adbWrapperMock.object,
            commandSenderMock.object,
            telemetryEventHandlerMock.object,
            deviceConnectionActionsMock.object,
            loggerMock.object,
        );
        testSubject.setDeviceId(deviceId);
        testSubject.setPort(port);
    });

    describe('Success paths', () => {
        it('enableFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Enable))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_ENABLE, {}))
                .verifiable(Times.once());
            setFocusActionsForSuccess();

            await testSubject.enableFocusTracking();

            verifyAllMocks();
        });

        it('disableFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Disable))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_DISABLE, {}))
                .verifiable(Times.once());
            setFocusActionsForSuccess();

            await testSubject.disableFocusTracking();

            verifyAllMocks();
        });

        it('resetFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Reset))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_RESET, {}))
                .verifiable(Times.once());

            await testSubject.resetFocusTracking();

            verifyAllMocks();
        });

        it('sendUpKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Up);
            setFocusActionsForSuccess();

            await testSubject.sendUpKey();

            verifyAllMocks();
        });

        it('sendDownKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Down))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Down);
            setFocusActionsForSuccess();

            await testSubject.sendDownKey();

            verifyAllMocks();
        });

        it('sendLeftKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Left))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Left);
            setFocusActionsForSuccess();

            await testSubject.sendLeftKey();

            verifyAllMocks();
        });

        it('sendRightKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Right))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Right);
            setFocusActionsForSuccess();

            await testSubject.sendRightKey();

            verifyAllMocks();
        });

        it('sendEnterKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Enter))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Enter);
            setFocusActionsForSuccess();

            await testSubject.sendEnterKey();

            verifyAllMocks();
        });

        it('sendTabKey sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Tab))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Tab);
            setFocusActionsForSuccess();

            await testSubject.sendTabKey();

            verifyAllMocks();
        });

        function setFocusActionsForSuccess(): void {
            statusConnectedMock
                .setup(m => m.invoke((It.isAny(), It.isAny())))
                .verifiable(Times.once());
            deviceConnectionActionsMock
                .setup(m => m.statusConnected)
                .returns(() => statusConnectedMock.object)
                .verifiable(Times.once());
        }
    });

    describe('Error paths', () => {
        const errorMessage: string = 'Welcome to the dark side';

        it('enableFocusTracking sets error, logs, sends telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Enable))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_ENABLE, {}))
                .verifiable(Times.once());
            setMocksForFocusError();

            await testSubject.enableFocusTracking();

            verifyAllMocks();
        });

        it('disableFocusTracking sets error, logs, sends telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Disable))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_DISABLE, {}))
                .verifiable(Times.once());
            setMocksForFocusError();

            await testSubject.disableFocusTracking();

            verifyAllMocks();
        });

        it('resetFocusTracking sets error, logs, sends telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Reset))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_RESET, {}))
                .verifiable(Times.once());
            setMocksForFocusError();

            await testSubject.resetFocusTracking();

            verifyAllMocks();
        });

        it('sendUpKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Up);
            setMocksForFocusError();

            await testSubject.sendUpKey();

            verifyAllMocks();
        });

        it('sendDownKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Down))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Down);
            setMocksForFocusError();

            await testSubject.sendDownKey();

            verifyAllMocks();
        });

        it('sendLeftKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Left))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Left);
            setMocksForFocusError();

            await testSubject.sendLeftKey();

            verifyAllMocks();
        });

        it('sendRightKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Right))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Right);
            setMocksForFocusError();

            await testSubject.sendRightKey();

            verifyAllMocks();
        });

        it('sendEnterKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Enter))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Enter);
            setMocksForFocusError();

            await testSubject.sendEnterKey();

            verifyAllMocks();
        });

        it('sendTabKey sets error, logs, sends telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Tab))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());
            setTelemetryMockForKeyEvent(KeyEventCode.Tab);
            setMocksForFocusError();

            await testSubject.sendTabKey();

            verifyAllMocks();
        });

        function setMocksForFocusError(): void {
            telemetryEventHandlerMock
                .setup(m => m.publishTelemetry(DEVICE_FOCUS_ERROR, {}))
                .verifiable(Times.once());
            loggerMock
                .setup(m => m.log('focus controller failure: ' + errorMessage))
                .verifiable(Times.once());
            statusDisconnectedMock
                .setup(m => m.invoke((It.isAny(), It.isAny())))
                .verifiable(Times.once());
            deviceConnectionActionsMock
                .setup(m => m.statusDisconnected)
                .returns(() => statusDisconnectedMock.object)
                .verifiable(Times.once());
        }
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

    function verifyAllMocks(): void {
        adbWrapperMock.verifyAll();
        commandSenderMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
        deviceConnectionActionsMock.verifyAll();
        loggerMock.verifyAll();
        statusDisconnectedMock.verifyAll();
        statusConnectedMock.verifyAll();
    }
});
