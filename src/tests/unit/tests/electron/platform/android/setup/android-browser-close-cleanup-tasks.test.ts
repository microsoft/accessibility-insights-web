// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';
import { Logger } from 'common/logging/logger';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { AndroidBrowserCloseCleanupTasks } from 'electron/platform/android/setup/android-browser-close-cleanup-tasks';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidBrowserCloseCleanupTasks', () => {
    let asyncActionMock: IMock<AsyncAction<undefined>>;
    let deviceFocusControllerMock: IMock<DeviceFocusController>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidBrowserCloseCleanupTasks;
    let callback: () => Promise<void>;

    beforeEach(() => {
        asyncActionMock = Mock.ofType<AsyncAction<undefined>>(undefined, MockBehavior.Strict);
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>(
            undefined,
            MockBehavior.Strict,
        );
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);

        const ipcRendererShimStub = {
            fromBrowserWindowClose: asyncActionMock.object,
        } as IpcRendererShim;

        testSubject = new AndroidBrowserCloseCleanupTasks(
            ipcRendererShimStub,
            deviceFocusControllerMock.object,
            loggerMock.object,
        );

        asyncActionMock.setup(m => m.addListener(It.isAny())).callback(cb => (callback = cb));

        testSubject.addBrowserCloseListener();
    });

    function verifyAllMocks() {
        deviceFocusControllerMock.verifyAll();
        loggerMock.verifyAll();
    }

    it('Calls resetFocusTracking if visualizationCleaner throws', async () => {
        const errorMessage = 'threw in visualization cleaner';

        deviceFocusControllerMock
            .setup(tsvc => tsvc.resetFocusTracking())
            .returns(() => Promise.reject(errorMessage))
            .verifiable(Times.once());

        loggerMock.setup(m => m.log(errorMessage)).verifiable(Times.once());

        await callback();

        verifyAllMocks();
    });
});
