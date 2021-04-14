// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidPortCleaner', () => {
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidPortCleaner;

    beforeEach(() => {
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);

        testSubject = new AndroidPortCleaner(loggerMock.object);
    });

    afterEach(() => {
        serviceConfigMock.verifyAll();
        loggerMock.verifyAll();
    });

    it('action invocation does nothing if no serviceConfig is set', async () => {
        await testSubject.removeRemainingPorts();
    });

    it('action invocation does nothing if serviceConfig is set then cleared', async () => {
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.setServiceConfig(null);

        await testSubject.removeRemainingPorts();
    });

    it('action invocation does nothing if serviceConfig is set but no ports are added', async () => {
        testSubject.setServiceConfig(serviceConfigMock.object);

        await testSubject.removeRemainingPorts();
    });

    it('action invocation does nothing if serviceConfig is set but no ports are orphaned', async () => {
        const port: number = 5;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);

        await testSubject.removeRemainingPorts();
    });

    it('adding a port is idempotent (validated via action invocation)', async () => {
        const port: number = 6;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.addPort(port);
        testSubject.removePort(port);

        await testSubject.removeRemainingPorts();
    });

    it('removing a port is idempotent (validated via action invocation)', async () => {
        const port: number = 7;
        testSubject.setServiceConfig(serviceConfigMock.object);
        testSubject.addPort(port);
        testSubject.removePort(port);
        testSubject.removePort(port);

        await testSubject.removeRemainingPorts();
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

        await testSubject.removeRemainingPorts();

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

        await testSubject.removeRemainingPorts();

        expect(actualError.message).toBe(expectedMessage);
    });
});
