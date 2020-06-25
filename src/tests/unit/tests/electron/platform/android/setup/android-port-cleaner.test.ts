// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidPortCleaner', () => {
    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let ipcRendererShimMock: IMock<IpcRendererShim>;
    let testSubject: AndroidPortCleaner;

    beforeEach(() => {
        serviceConfigMock = Mock.ofType<AndroidServiceConfigurator>(undefined, MockBehavior.Strict);
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);
        testSubject = new AndroidPortCleaner(ipcRendererShimMock.object);
    });

    function verifyAllMocks(): void {
        serviceConfigMock.verifyAll();
        ipcRendererShimMock.verifyAll();
    }

    it('closeWindow calls shim if no serviceConfig is set', async () => {
        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());

        await testSubject.closeWindow();

        verifyAllMocks();
    });

    it('closeWindow calls serviceConfig and shim if serviceConfig is set', async () => {
        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.removeAllTcpForwarding())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        testSubject.setServiceConfig(serviceConfigMock.object);

        await testSubject.closeWindow();

        verifyAllMocks();
    });

    it('closeWindow calls shim if serviceConfig is set then cleared', async () => {
        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.setServiceConfig(null);

        await testSubject.closeWindow();

        verifyAllMocks();
    });
});
