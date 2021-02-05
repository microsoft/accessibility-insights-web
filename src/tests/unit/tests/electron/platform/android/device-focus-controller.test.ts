// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
    let testSubject: DeviceFocusController;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        commandSenderMock = Mock.ofType<DeviceFocusCommandSender>(undefined, MockBehavior.Strict);
        testSubject = new DeviceFocusController(adbWrapperMock.object, commandSenderMock.object);
        testSubject.setDeviceId(deviceId);
        testSubject.setPort(port);
    });

    it('EnableFocusTracking sends correct command', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Enable))
            .verifiable(Times.once());

        await testSubject.EnableFocusTracking();

        commandSenderMock.verifyAll();
    });

    it('DisableFocusTracking sends correct command', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Disable))
            .verifiable(Times.once());

        await testSubject.DisableFocusTracking();

        commandSenderMock.verifyAll();
    });

    it('ResetFocusTracking sends correct command', async () => {
        commandSenderMock
            .setup(getter => getter(port, DeviceFocusCommand.Reset))
            .verifiable(Times.once());

        await testSubject.ResetFocusTracking();

        commandSenderMock.verifyAll();
    });

    it('SendUpKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
            .verifiable(Times.once());

        await testSubject.SendUpKey();

        adbWrapperMock.verifyAll();
    });

    it('SendDownKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Down))
            .verifiable(Times.once());

        await testSubject.SendDownKey();

        adbWrapperMock.verifyAll();
    });

    it('SendLeftKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Left))
            .verifiable(Times.once());

        await testSubject.SendLeftKey();

        adbWrapperMock.verifyAll();
    });

    it('SendRightKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Right))
            .verifiable(Times.once());

        await testSubject.SendRightKey();

        adbWrapperMock.verifyAll();
    });

    it('SendEnterKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Enter))
            .verifiable(Times.once());

        await testSubject.SendEnterKey();

        adbWrapperMock.verifyAll();
    });

    it('SendTabKey sends correct command', async () => {
        adbWrapperMock
            .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Tab))
            .verifiable(Times.once());

        await testSubject.SendTabKey();

        adbWrapperMock.verifyAll();
    });
});
