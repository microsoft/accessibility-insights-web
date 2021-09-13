// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidDeviceConfigurator,
    DeviceConfigurator,
} from 'electron/platform/android/setup/android-device-configurator';
import { AndroidDeviceConfiguratorFactory } from 'electron/platform/android/setup/android-device-configurator-factory';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('AndroidDeviceConfiguratorFactory', () => {
    let adbWrapperMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let friendlyDeviceNameProviderMock: IMock<AndroidFriendlyDeviceNameProvider>;
    let testSubject: AndroidDeviceConfiguratorFactory;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        friendlyDeviceNameProviderMock = Mock.ofType<AndroidFriendlyDeviceNameProvider>(
            undefined,
            MockBehavior.Strict,
        );
        testSubject = new AndroidDeviceConfiguratorFactory(
            apkLocatorMock.object,
            friendlyDeviceNameProviderMock.object,
        );
    });

    it('getDeviceConfig returns correct object', () => {
        const deviceConfig: DeviceConfigurator = testSubject.getDeviceConfigurator(
            adbWrapperMock.object,
        );

        expect(deviceConfig).toBeInstanceOf(AndroidDeviceConfigurator);
    });
});
