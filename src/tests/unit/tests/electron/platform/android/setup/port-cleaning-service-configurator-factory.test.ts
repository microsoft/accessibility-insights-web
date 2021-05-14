// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { PortCleaningServiceConfigurator } from 'electron/platform/android/setup/port-cleaning-service-configurator';
import { PortCleaningServiceConfiguratorFactory } from 'electron/platform/android/setup/port-cleaning-service-configurator-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('PortCleaningServiceConfiguratorFactory', () => {
    let innerFactoryMock: IMock<ServiceConfiguratorFactory>;
    let portCleanerMock: IMock<AndroidPortCleaner>;
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let testSubject: PortCleaningServiceConfiguratorFactory;
    let adbWrapperStub: AdbWrapper;

    beforeEach(() => {
        innerFactoryMock = Mock.ofType<ServiceConfiguratorFactory>(undefined, MockBehavior.Strict);
        portCleanerMock = Mock.ofType<AndroidPortCleaner>(undefined, MockBehavior.Strict);
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        testSubject = new PortCleaningServiceConfiguratorFactory(
            innerFactoryMock.object,
            portCleanerMock.object,
        );
        adbWrapperStub = {} as AdbWrapper;
    });

    function verifyAllMocks(): void {
        innerFactoryMock.verifyAll();
        portCleanerMock.verifyAll();
    }

    it('getServiceConfig returns correct object after linking to cleaner', () => {
        const expectedServiceConfig: ServiceConfigurator = serviceConfigMock.object;
        let attachedServiceConfig: ServiceConfigurator;
        innerFactoryMock
            .setup(m => m.getServiceConfigurator(adbWrapperStub))
            .returns(() => expectedServiceConfig)
            .verifiable(Times.once());
        portCleanerMock
            .setup(m => m.setServiceConfig(It.isAny()))
            .callback(config => (attachedServiceConfig = config as ServiceConfigurator))
            .verifiable(Times.once());

        const finalServiceConfig: ServiceConfigurator =
            testSubject.getServiceConfigurator(adbWrapperStub);

        expect(finalServiceConfig).toBeInstanceOf(PortCleaningServiceConfigurator);
        expect(attachedServiceConfig).toBeInstanceOf(PortCleaningServiceConfigurator);

        verifyAllMocks();
    });
});
