// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { AdbWrapper, KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceFocusController tests', () => {
    const deviceId: string = 'some device';
    const port: number = 23456;

    let adbWrapperHolderMock: IMock<AdbWrapperHolder>;
    let adbWrapperMock: IMock<AdbWrapper>;
    let androidSetupStoreMock: IMock<AndroidSetupStore>;
    let commandSenderMock: IMock<DeviceFocusCommandSender>;
    let testSubject: DeviceFocusController;

    beforeEach(() => {
        adbWrapperHolderMock = Mock.ofType<AdbWrapperHolder>(undefined, MockBehavior.Strict);
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        androidSetupStoreMock = Mock.ofType<AndroidSetupStore>();
        commandSenderMock = Mock.ofType<DeviceFocusCommandSender>(undefined, MockBehavior.Strict);

        adbWrapperHolderMock.setup(m => m.getAdb()).returns(() => adbWrapperMock.object);

        testSubject = new DeviceFocusController(
            adbWrapperHolderMock.object,
            commandSenderMock.object,
            androidSetupStoreMock.object,
        );
    });

    describe('Success paths', () => {
        beforeEach(() => {
            const androidSetupStoreData: AndroidSetupStoreData = {
                scanPort: port,
                selectedDevice: {
                    id: deviceId,
                },
            } as AndroidSetupStoreData;
            androidSetupStoreMock.setup(m => m.getState()).returns(() => androidSetupStoreData);
        });

        it('enableFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Enable))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.enableFocusTracking();
            verifyAllMocks();
        });

        it('disableFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Disable))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.disableFocusTracking();

            verifyAllMocks();
        });

        it('resetFocusTracking sends correct command and telemetry', async () => {
            commandSenderMock
                .setup(getter => getter(port, DeviceFocusCommand.Reset))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.resetFocusTracking();

            verifyAllMocks();
        });

        it('sendKeyEvent sends correct command and telemetry', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.sendKeyEvent(KeyEventCode.Up);

            verifyAllMocks();
        });
    });

    describe('Error: (no store data) paths', () => {
        beforeEach(() => {
            const androidSetupStoreData: AndroidSetupStoreData = {} as AndroidSetupStoreData;
            androidSetupStoreMock.setup(m => m.getState()).returns(() => androidSetupStoreData);
        });

        it('enableFocusTracking', async () => {
            await expect(testSubject.enableFocusTracking()).rejects.toThrowError(
                'scan port not found',
            );
        });

        it('disableFocusTracking', async () => {
            await expect(testSubject.disableFocusTracking()).rejects.toThrowError(
                'scan port not found',
            );
        });

        it('resetFocusTracking', async () => {
            await expect(testSubject.resetFocusTracking()).rejects.toThrowError(
                'scan port not found',
            );
        });

        it('sendKeyEvent', async () => {
            await expect(testSubject.sendKeyEvent(KeyEventCode.Up)).rejects.toThrowError(
                'selected device not found',
            );
        });
    });

    function verifyAllMocks(): void {
        adbWrapperMock.verifyAll();
        commandSenderMock.verifyAll();
    }
});
