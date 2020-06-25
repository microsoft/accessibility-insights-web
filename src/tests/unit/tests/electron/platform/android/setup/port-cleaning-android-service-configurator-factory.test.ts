// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { PortCleaningAndroidServiceConfiguratorFactory } from 'electron/platform/android/setup/port-cleaning-android-service-configurator-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('PortCleaningAndroidServiceConfiguratorFactory', () => {
    let innerFactoryMock: IMock<ServiceConfiguratorFactory>;
    let portCleanerMock: IMock<AndroidPortCleaner>;
    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let testSubject: PortCleaningAndroidServiceConfiguratorFactory;

    beforeEach(() => {
        innerFactoryMock = Mock.ofType<ServiceConfiguratorFactory>(undefined, MockBehavior.Strict);
        portCleanerMock = Mock.ofType<AndroidPortCleaner>(undefined, MockBehavior.Strict);
        serviceConfigMock = Mock.ofType<AndroidServiceConfigurator>(undefined, MockBehavior.Strict);
        testSubject = new PortCleaningAndroidServiceConfiguratorFactory(
            innerFactoryMock.object,
            portCleanerMock.object,
        );

        // This gets awaited TWICE--once by the mock framework and once by the code
        serviceConfigMock
            .setup((m: any) => m.then)
            .returns(() => undefined)
            .verifiable(Times.atLeast(1));
    });

    function verifyAllMocks(): void {
        innerFactoryMock.verifyAll();
        portCleanerMock.verifyAll();
        serviceConfigMock.verifyAll();
    }

    it('getServiceConfig returns correct object after linking to cleaner', async () => {
        const expectedAdbLocation: string = 'Some location';
        let attachedServiceConfig: AndroidServiceConfigurator;
        innerFactoryMock
            .setup(m => m.getServiceConfigurator(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());
        portCleanerMock
            .setup(m => m.setServiceConfig(It.isAny()))
            .callback(config => (attachedServiceConfig = config))
            .verifiable(Times.once());

        const finalServiceConfig: AndroidServiceConfigurator = await testSubject.getServiceConfigurator(
            expectedAdbLocation,
        );

        expect(finalServiceConfig).toBe(serviceConfigMock.object);
        expect(attachedServiceConfig).toBe(serviceConfigMock.object);

        verifyAllMocks();
    });
});
