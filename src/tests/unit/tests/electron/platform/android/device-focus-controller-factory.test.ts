// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusControllerFactory } from 'electron/platform/android/device-focus-controller-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusControllerFactory tests', () => {
    let adbWrapperFactoryMock: IMock<AdbWrapperFactory>;
    let testSubject: DeviceFocusControllerFactory;

    const focusCommandSenderMock: IMock<DeviceFocusCommandSender> = Mock.ofType<DeviceFocusCommandSender>(
        undefined,
        MockBehavior.Strict,
    );

    beforeEach(() => {
        adbWrapperFactoryMock = Mock.ofType<AdbWrapperFactory>(undefined, MockBehavior.Strict);
        testSubject = new DeviceFocusControllerFactory(
            adbWrapperFactoryMock.object,
            focusCommandSenderMock.object,
        );
    });

    it('initialize is just a placeholder', () => {
        testSubject.initialize();
    });

    it('getDeviceFocusController returns correct type', async () => {
        const adbLocation = 'In a galaxy far, far away';

        const adbWrapperMock: IMock<AdbWrapper> = Mock.ofType<AdbWrapper>(
            undefined,
            MockBehavior.Strict,
        );
        adbWrapperFactoryMock
            .setup(m => m.createValidatedAdbWrapper(adbLocation))
            .returns(() => Promise.resolve<AdbWrapper>(adbWrapperMock.object))
            .verifiable(Times.once());

        const promise = testSubject.getDeviceFocusController(adbLocation);

        expect(promise).resolves.toBeInstanceOf(DeviceFocusController);

        adbWrapperMock.verifyAll();
        adbWrapperFactoryMock.verifyAll();
    });
});
