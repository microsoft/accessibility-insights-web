// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { AndroidServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidServiceSetupBusinessLogicFactory', () => {
    let adbWrapperFactoryMock: IMock<AdbWrapperFactory>;
    let adbWrapperMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let testSubject: AndroidServiceConfiguratorFactory;

    beforeEach(() => {
        adbWrapperFactoryMock = Mock.ofType<AdbWrapperFactory>(undefined, MockBehavior.Strict);
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        testSubject = new AndroidServiceConfiguratorFactory(
            adbWrapperFactoryMock.object,
            apkLocatorMock.object,
        );
    });

    it('getBusinessLogic returns correct object', async () => {
        const expectedAdbLocation: string = 'Some location';
        adbWrapperFactoryMock
            .setup(m => m.getAdbWrapper(expectedAdbLocation))
            .returns(() => Promise.resolve(adbWrapperMock.object))
            .verifiable(Times.once());
        adbWrapperMock.setup((m: any) => m.then).returns(() => undefined);

        const businessLogic: AndroidServiceConfigurator = await testSubject.getBusinessLogic(
            expectedAdbLocation,
        );

        expect(businessLogic).toBeInstanceOf(AndroidServiceConfigurator);

        adbWrapperFactoryMock.verifyAll();
    });
});
