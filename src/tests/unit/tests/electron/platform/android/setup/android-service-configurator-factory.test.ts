// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    PortFinder,
    ServiceConfigurator,
} from 'electron/platform/android/setup/android-service-configurator';
import { AndroidServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('AndroidServiceConfiguratorFactory', () => {
    let adbWrapperMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let portFinderMock: IMock<PortFinder>;
    let testSubject: AndroidServiceConfiguratorFactory;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        portFinderMock = Mock.ofType<PortFinder>(undefined, MockBehavior.Strict);
        testSubject = new AndroidServiceConfiguratorFactory(
            apkLocatorMock.object,
            portFinderMock.object,
        );
    });

    it('getServiceConfig returns correct object', () => {
        const serviceConfig: ServiceConfigurator = testSubject.getServiceConfigurator(
            adbWrapperMock.object,
        );

        expect(serviceConfig).toBeInstanceOf(AndroidServiceConfigurator);
    });
});
