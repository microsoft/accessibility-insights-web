// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { AdbWrapper, KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { AndroidServicePackageName } from 'electron/platform/android/android-service-apk-locator';
import { DeviceCommunicator } from 'electron/platform/android/device-communicator';
import {
    DeviceFocusCommand,
    FocusCommandPrefix,
} from 'electron/platform/android/device-focus-controller';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DeviceCommunicator tests', () => {
    const deviceId: string = 'some device';
    const servicePackageName: string = AndroidServicePackageName;
    const testContentUri: string = `content://${servicePackageName}`;
    let adbWrapperHolderMock: IMock<AdbWrapperHolder>;
    let adbWrapperMock: IMock<AdbWrapper>;
    let androidSetupStoreMock: IMock<AndroidSetupStore>;
    let testSubject: DeviceCommunicator;

    beforeEach(() => {
        adbWrapperHolderMock = Mock.ofType<AdbWrapperHolder>(undefined, MockBehavior.Strict);
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        androidSetupStoreMock = Mock.ofType<AndroidSetupStore>();

        adbWrapperHolderMock.setup(m => m.getAdb()).returns(() => adbWrapperMock.object);
        testSubject = new DeviceCommunicator(
            adbWrapperHolderMock.object,
            androidSetupStoreMock.object,
        );
    });

    describe('with selected device store data', () => {
        beforeEach(() => {
            const androidSetupStoreData: AndroidSetupStoreData = {
                selectedDevice: {
                    id: deviceId,
                },
            } as AndroidSetupStoreData;
            androidSetupStoreMock.setup(m => m.getState()).returns(() => androidSetupStoreData);
        });

        it('fetchContent sends correct command and returns data', async () => {
            const stringifiedResults = 'string results content';
            const testContentType = 'result';
            adbWrapperMock
                .setup(m => m.readContent(deviceId, `${testContentUri}/${testContentType}`))
                .returns(() => Promise.resolve(stringifiedResults))
                .verifiable(Times.once());

            const content = await testSubject.fetchContent('result');
            expect(content).toEqual(stringifiedResults);
            verifyAllMocks();
        });

        it('fetchContent propagates errors', async () => {
            const expectedError = 'error from readContent';
            const testContentType = 'result';
            adbWrapperMock
                .setup(m => m.readContent(deviceId, `${testContentUri}/${testContentType}`))
                .throws(new Error(expectedError))
                .verifiable(Times.once());

            await expect(testSubject.fetchContent('result')).rejects.toThrowError(expectedError);
            verifyAllMocks();
        });

        it('sendCommand sends correct command', async () => {
            adbWrapperMock
                .setup(m =>
                    m.callContent(
                        deviceId,
                        testContentUri,
                        `${FocusCommandPrefix}/${DeviceFocusCommand.Disable}`,
                    ),
                )
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.sendCommand(`${FocusCommandPrefix}/${DeviceFocusCommand.Disable}`);
            verifyAllMocks();
        });

        it('sendCommand propagates errors', async () => {
            const expectedError = 'error from callContent';
            const testCommand = 'DO_SOMETHING';
            adbWrapperMock
                .setup(m => m.callContent(deviceId, testContentUri, testCommand))
                .throws(new Error(expectedError))
                .verifiable(Times.once());

            await expect(testSubject.sendCommand(testCommand)).rejects.toThrow(expectedError);
            verifyAllMocks();
        });

        it('pressKey sends key input', async () => {
            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.pressKey(KeyEventCode.Up);

            verifyAllMocks();
        });

        it('pressKey propagates errors', async () => {
            const expectedError = 'error from sendKeyEvent';

            adbWrapperMock
                .setup(m => m.sendKeyEvent(deviceId, KeyEventCode.Up))
                .throws(new Error(expectedError))
                .verifiable(Times.once());

            await expect(testSubject.pressKey(KeyEventCode.Up)).rejects.toThrow(expectedError);

            verifyAllMocks();
        });
    });

    describe('Error: (no store data) paths', () => {
        beforeEach(() => {
            const androidSetupStoreData: AndroidSetupStoreData = {} as AndroidSetupStoreData;
            androidSetupStoreMock.setup(m => m.getState()).returns(() => androidSetupStoreData);
        });

        it('sendCommand', async () => {
            await expect(testSubject.sendCommand('someCommand')).rejects.toThrowError(
                'selected device not found',
            );
        });

        it('fetchContent', async () => {
            await expect(testSubject.fetchContent('config')).rejects.toThrowError(
                'selected device not found',
            );
        });

        it('sendKeyEvent', async () => {
            await expect(testSubject.pressKey(KeyEventCode.Up)).rejects.toThrowError(
                'selected device not found',
            );
        });
    });

    function verifyAllMocks(): void {
        adbWrapperMock.verifyAll();
    }
});
