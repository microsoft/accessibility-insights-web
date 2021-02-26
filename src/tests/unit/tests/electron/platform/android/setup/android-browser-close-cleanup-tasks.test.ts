// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AsyncAction } from 'electron/ipc/async-action';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { AndroidBrowserCloseCleanupTasks } from 'electron/platform/android/setup/android-browser-close-cleanup-tasks';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidBrowserCloseCleanupTasks', () => {
    let asyncActionMock: IMock<AsyncAction>;
    let deviceFocusControllerMock: IMock<DeviceFocusController>;
    let androidPortCleanerMock: IMock<AndroidPortCleaner>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidBrowserCloseCleanupTasks;
    let callback: () => Promise<void>;

    beforeEach(() => {
        asyncActionMock = Mock.ofType<AsyncAction>(undefined, MockBehavior.Strict);
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>(
            undefined,
            MockBehavior.Strict,
        );
        androidPortCleanerMock = Mock.ofType<AndroidPortCleaner>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);

        const ipcRendererShimStub = {
            fromBrowserWindowClose: asyncActionMock.object,
        } as IpcRendererShim;

        testSubject = new AndroidBrowserCloseCleanupTasks(
            ipcRendererShimStub,
            deviceFocusControllerMock.object,
            androidPortCleanerMock.object,
            loggerMock.object,
        );

        asyncActionMock.setup(m => m.addAsyncListener(It.isAny())).callback(cb => (callback = cb));

        testSubject.addBrowserCloseListener();
    });

    function verifyAllMocks() {
        deviceFocusControllerMock.verifyAll();
        androidPortCleanerMock.verifyAll();
        loggerMock.verifyAll();
    }

    it('All cleanup tasks are called and in order', async () => {
        const callHistory = [];
        deviceFocusControllerMock
            .setup(tsvc => tsvc.resetFocusTracking())
            .callback(() => callHistory.push('resetFocusTracking'))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        androidPortCleanerMock
            .setup(apc => apc.removeRemainingPorts())
            .callback(() => callHistory.push('removeRemainingPorts'))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        await callback();

        expect(callHistory).toEqual(['resetFocusTracking', 'removeRemainingPorts']);

        verifyAllMocks();
    });

    it('Calls removeRemainingPorts if visualizationCleaner throws', async () => {
        const errorMessage = 'threw in visualization cleaner';

        deviceFocusControllerMock
            .setup(tsvc => tsvc.resetFocusTracking())
            .returns(() => Promise.reject(errorMessage))
            .verifiable(Times.once());

        androidPortCleanerMock
            .setup(apc => apc.removeRemainingPorts())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        loggerMock.setup(m => m.log(errorMessage)).verifiable(Times.once());

        await callback();

        verifyAllMocks();
    });

    it('calls disableFocusTracking if portCleaner throws', async () => {
        const errorMessage = 'threw in port cleaner';

        deviceFocusControllerMock
            .setup(tsvc => tsvc.resetFocusTracking())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        androidPortCleanerMock
            .setup(apc => apc.removeRemainingPorts())
            .returns(() => Promise.reject(errorMessage))
            .verifiable(Times.once());

        loggerMock.setup(m => m.log(errorMessage)).verifiable(Times.once());

        await callback();

        verifyAllMocks();
    });
});
