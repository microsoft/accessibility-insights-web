// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidDeviceConfigurator,
    DeviceConfigurator,
} from 'electron/platform/android/setup/android-device-configurator';

export interface DeviceConfiguratorFactory {
    getDeviceConfigurator(adbWrapper: AdbWrapper): DeviceConfigurator;
}

export class AndroidDeviceConfiguratorFactory implements DeviceConfiguratorFactory {
    constructor(
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly friendlyDeviceNameProvider: AndroidFriendlyDeviceNameProvider,
    ) {}

    public getDeviceConfigurator = (adbWrapper: AdbWrapper): DeviceConfigurator => {
        return new AndroidDeviceConfigurator(
            adbWrapper,
            this.apkLocator,
            this.friendlyDeviceNameProvider,
        );
    };
}
