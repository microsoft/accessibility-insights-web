// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AsyncAction } from 'electron/ipc/async-action';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidPortCleaner', () => {
    let asyncActionMock: IMock<AsyncAction>;
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidPortCleaner;
    let callback: () => Promise<void>;

    beforeEach(() => {
        asyncActionMock = Mock.ofType<AsyncAction>(undefined, MockBehavior.Strict);
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);

        const ipcRendererShimStub = {
            fromBrowserWindowClose: asyncActionMock.object,
        } as IpcRendererShim;

        testSubject = new AndroidPortCleaner(ipcRendererShimStub, loggerMock.object);

        asyncActionMock.setup(m => m.addAsyncListener(It.isAny())).callback(cb => (callback = cb));

        testSubject.initialize();
    });

    afterEach(() => {
        asyncActionMock.verifyAll();
        serviceConfigMock.verifyAll();
        loggerMock.verifyAll();
    });

    it('action invocation does nothing if no serviceConfig is set', async () => {
        await callback();
    });

    it('action invocation does nothing if serviceConfig is set then cleared', async () => {
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.setServiceConfig(null);

        await callback();
    });

    it('action invocation does nothing if serviceConfig is set but no ports are added', async () => {
        testSubject.setServiceConfig(serviceConfigMock.object);

        await callback();
    });

    it('action invocation does nothing if serviceConfig is set but no ports are orphaned', async () => {
        const port: number = 5;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);

        await callback();
    });

    it('adding a port is idempotent (validated via action invocation)', async () => {
        const port: number = 6;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.addPort(port);
        testSubject.removePort(port);

        await callback();
    });

    it('removing a port is idempotent (validated via action invocation)', async () => {
        const port: number = 7;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);
        testSubject.removePort(port);

        await callback();
    });

    it('orphaned ports get removed on action invocation', async () => {
        const port1 = 10;
        const port2 = 20;
        const port3 = 30;
        const removedPorts: number[] = [];
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(It.isAnyNumber()))
            .callback(removedPort => removedPorts.push(removedPort))
            .returns(() => Promise.resolve())
            .verifiable(Times.exactly(2));
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port1);
        testSubject.addPort(port2);
        testSubject.addPort(port3);
        testSubject.removePort(port2);

        await callback();

        expect(removedPorts.length).toBe(2);
        expect(removedPorts).toContain(port1);
        expect(removedPorts).toContain(port3);
    });

    it('errors in port removal are logged', async () => {
        const expectedMessage = 'thrown during removeTcpForwarding';
        const port = 10;
        let actualError: Error;
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(port))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());
        loggerMock
            .setup(m => m.log(It.isAny()))
            .callback(e => (actualError = e as Error))
            .verifiable(Times.once());
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);

        await callback();

        expect(actualError.message).toBe(expectedMessage);
    });
});
