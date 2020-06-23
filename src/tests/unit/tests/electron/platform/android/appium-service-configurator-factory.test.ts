// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { AppiumAdbCreator } from 'electron/platform/android/appium-adb-creator';
import {
    AppiumServiceConfigurator,
    PortFinder,
} from 'electron/platform/android/appium-service-configurator';
import { AppiumServiceConfiguratorFactory } from 'electron/platform/android/appium-service-configurator-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AppiumServiceConfiguratorFactory tests', () => {
    let adbCreatorMock: IMock<AppiumAdbCreator>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let portFinderMock: IMock<PortFinder>;

    beforeEach(() => {
        adbCreatorMock = Mock.ofType<AppiumAdbCreator>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        portFinderMock = Mock.ofType<PortFinder>(undefined, MockBehavior.Strict);
    });

    it('getServiceConfigurator creates without parameters if no sdkRoot is provided', async () => {
        adbCreatorMock
            .setup(m => m.createADB(undefined))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumServiceConfiguratorFactory(
            adbCreatorMock.object,
            apkLocatorMock.object,
            portFinderMock.object,
        );

        expect(await factory.getServiceConfigurator(null)).toBeInstanceOf(
            AppiumServiceConfigurator,
        );

        verifyAllMocks();
    });

    it('getServiceConfigurator creates with sdkRoot if it is provided', async () => {
        const expectedSdkRoot = 'path/to/android/sdk';
        adbCreatorMock
            .setup(m => m.createADB({ sdkRoot: expectedSdkRoot }))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumServiceConfiguratorFactory(
            adbCreatorMock.object,
            apkLocatorMock.object,
            portFinderMock.object,
        );

        expect(await factory.getServiceConfigurator(expectedSdkRoot)).toBeInstanceOf(
            AppiumServiceConfigurator,
        );

        verifyAllMocks();
    });

    it('getServiceConfigurator propagates error to caller', async () => {
        const expectedMessage = 'Something bad happened';
        adbCreatorMock
            .setup(m => m.createADB(undefined))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());
        const factory = new AppiumServiceConfiguratorFactory(
            adbCreatorMock.object,
            apkLocatorMock.object,
            portFinderMock.object,
        );

        await expect(factory.getServiceConfigurator(null)).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    function verifyAllMocks(): void {
        adbCreatorMock.verifyAll();
        apkLocatorMock.verifyAll();
        portFinderMock.verifyAll();
    }
});
