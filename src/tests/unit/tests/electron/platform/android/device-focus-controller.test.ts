// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { DeviceCommunicator } from 'electron/platform/android/device-communicator';
import {
    DeviceFocusController,
    DeviceFocusCommand,
    FocusCommandPrefix,
} from 'electron/platform/android/device-focus-controller';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusController tests', () => {
    let deviceCommunicatorMock: IMock<DeviceCommunicator>;
    let testSubject: DeviceFocusController;

    beforeEach(() => {
        deviceCommunicatorMock = Mock.ofType<DeviceCommunicator>(undefined, MockBehavior.Strict);
        testSubject = new DeviceFocusController(deviceCommunicatorMock.object);
    });

    describe('Success paths', () => {
        it('enableFocusTracking sends correct command', async () => {
            deviceCommunicatorMock
                .setup(m => m.sendCommand(`${FocusCommandPrefix}/${DeviceFocusCommand.Enable}`))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            await testSubject.enableFocusTracking();
            verifyAllMocks();
        });

        it('disableFocusTracking sends correct command', async () => {
            deviceCommunicatorMock
                .setup(m => m.sendCommand(`${FocusCommandPrefix}/${DeviceFocusCommand.Disable}`))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.disableFocusTracking();

            verifyAllMocks();
        });

        it('resetFocusTracking sends correct command', async () => {
            deviceCommunicatorMock
                .setup(m => m.sendCommand(`${FocusCommandPrefix}/${DeviceFocusCommand.Reset}`))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            await testSubject.resetFocusTracking();

            verifyAllMocks();
        });

        it('sendKeyEvent sends correct command', async () => {
            deviceCommunicatorMock
                .setup(m => m.pressKey(KeyEventCode.Up))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.sendKeyEvent(KeyEventCode.Up);

            verifyAllMocks();
        });
    });

    function verifyAllMocks(): void {
        deviceCommunicatorMock.verifyAll();
    }
});
