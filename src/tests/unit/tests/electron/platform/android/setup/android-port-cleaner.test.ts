// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ExpectedInput } from 'assessments/custom-widgets/test-steps/expected-input';

describe('AndroidPortCleaner', () => {
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let ipcRendererShimMock: IMock<IpcRendererShim>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidPortCleaner;

    beforeEach(() => {
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        testSubject = new AndroidPortCleaner(ipcRendererShimMock.object, loggerMock.object);
    });

    function verifyAllMocks(): void {
        serviceConfigMock.verifyAll();
        ipcRendererShimMock.verifyAll();
    }

    it('closeWindow calls ipcRenderShim if no serviceConfig is set', async () => {
        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());

        await testSubject.closeWindow();

        verifyAllMocks();
    });

    it('closeWindow calls ipcRenderShim if serviceConfig is set then cleared', async () => {
        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.setServiceConfig(null);

        await testSubject.closeWindow();

        verifyAllMocks();
    });

    it('closeWindow calls serviceConfig and ipcRenderShim if serviceConfig is set and ports are added', async () => {
        const addedPorts: number[] = [123, 345, 456];
        const actualPorts: number[] = [];

        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(It.isAnyNumber()))
            .callback(actualPort => actualPorts.push(actualPort))
            .returns(() => Promise.resolve())
            .verifiable(Times.exactly(addedPorts.length));
        testSubject.setServiceConfig(serviceConfigMock.object);
        for (const addedPort of addedPorts) {
            testSubject.addPort(addedPort);
        }

        await testSubject.closeWindow();

        expect(actualPorts).toEqual(addedPorts);

        verifyAllMocks();
    });

    it('closeWindow calls serviceConfig and ipcRenderShim if serviceConfig is set and ports are added but some removed', async () => {
        const addedPorts: number[] = [123, 345, 456];
        const removedPorts: number[] = [123, 456];

        ipcRendererShimMock.setup(m => m.closeWindow()).verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(345))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        testSubject.setServiceConfig(serviceConfigMock.object);
        for (const addedPort of addedPorts) {
            testSubject.addPort(addedPort);
        }
        for (const removedPort of removedPorts) {
            testSubject.removePort(removedPort);
        }

        await testSubject.closeWindow();

        verifyAllMocks();
    });

    it('removePort gracefully handles a value that was not previously added', () => {
        testSubject.removePort(5);

        verifyAllMocks();
    });
});
