// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { ipcRenderer } from 'electron';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { tick } from 'tests/unit/common/tick';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidPortCleaner', () => {
    let ipcRendererShim: IpcRendererShim;
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidPortCleaner;

    beforeEach(() => {
        ipcRendererShim = new IpcRendererShim(ipcRenderer);
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        testSubject = new AndroidPortCleaner(ipcRendererShim, loggerMock.object);
        testSubject.initialize();
    });

    afterEach(() => {
        serviceConfigMock.verifyAll();
        loggerMock.verifyAll();
    });

    it('action invocation does nothing if no serviceConfig is set', () => {
        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('action invocation does nothing if serviceConfig is set then cleared', () => {
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.setServiceConfig(null);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('action invocation does nothing if serviceConfig is set but no ports are added', () => {
        testSubject.setServiceConfig(serviceConfigMock.object);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('action invocation does nothing if serviceConfig is set but no ports are orphaned', () => {
        const port: number = 5;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('adding a port is idempotent (validated via action invocation)', () => {
        const port: number = 6;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.addPort(port);
        testSubject.removePort(port);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('removing a port is idempotent (validated via action invocation)', () => {
        const port: number = 7;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);
        testSubject.removePort(port);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
    });

    it('orphaned ports get removed on action invocation', async () => {
        const dummyPortList = new Array<string>();
        const port1 = 10;
        const port2 = 20;
        const port3 = 30;
        const removedPorts: number[] = [];
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(It.isAnyNumber()))
            .callback(removedPort => removedPorts.push(removedPort))
            .returns(() => Promise.resolve())
            .verifiable(Times.exactly(2));
        serviceConfigMock
            .setup(m => m.listForwardedPorts())
            .returns(() => Promise.resolve(dummyPortList))
            .verifiable(Times.exactly(2));
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port1);
        testSubject.addPort(port2);
        testSubject.addPort(port3);
        testSubject.removePort(port2);

        ipcRendererShim.fromBrowserWindowClose.invoke(null);
        await tick();

        expect(removedPorts.length).toBe(2);
        expect(removedPorts).toContain(port1);
        expect(removedPorts).toContain(port3);
    });

    it('errors in port removal are logged', () => {
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

        ipcRendererShim.fromBrowserWindowClose.invoke(null);

        expect(actualError.message).toBe(expectedMessage);
    });
});
