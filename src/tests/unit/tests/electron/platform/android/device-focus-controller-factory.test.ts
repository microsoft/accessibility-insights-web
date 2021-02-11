// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusControllerFactory } from 'electron/platform/android/device-focus-controller-factory';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('DeviceFocusControllerFactory tests', () => {
    let testSubject: DeviceFocusControllerFactory;

    const focusCommandSenderMock: IMock<DeviceFocusCommandSender> = Mock.ofType<DeviceFocusCommandSender>(
        undefined,
        MockBehavior.Strict,
    );

    beforeEach(() => {
        testSubject = new DeviceFocusControllerFactory(focusCommandSenderMock.object);
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
