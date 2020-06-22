// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { LiveAndroidServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidServiceSetupBusinessLogicFactory', () => {
    let serviceConfigFactoryMock: IMock<AdbWrapperFactory>;
    let serviceConfigMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let testSubject: LiveAndroidServiceConfiguratorFactory;

    beforeEach(() => {
        serviceConfigFactoryMock = Mock.ofType<AdbWrapperFactory>(undefined, MockBehavior.Strict);
        serviceConfigMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        testSubject = new LiveAndroidServiceConfiguratorFactory(
            serviceConfigFactoryMock.object,
            apkLocatorMock.object,
        );
    });

    it('getBusinessLogic returns correct object', async () => {
        const expectedAdbLocation: string = 'Some location';
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfigurator(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());
        serviceConfigMock.setup((m: any) => m.then).returns(() => undefined);

        const businessLogic: AndroidServiceConfigurator = await testSubject.getBusinessLogic(
            expectedAdbLocation,
        );

        expect(businessLogic).toBeInstanceOf(AndroidServiceConfigurator);

        serviceConfigFactoryMock.verifyAll();
    });
});
