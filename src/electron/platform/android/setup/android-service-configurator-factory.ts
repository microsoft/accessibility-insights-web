// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    PortFinder,
    ServiceConfigurator,
} from 'electron/platform/android/setup/android-service-configurator';

export interface ServiceConfiguratorFactory {
    getServiceConfigurator(adbWrapper: AdbWrapper): ServiceConfigurator;
}

export class AndroidServiceConfiguratorFactory implements ServiceConfiguratorFactory {
    constructor(
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly portFinder: PortFinder,
        private readonly friendlyDeviceNameProvider: AndroidFriendlyDeviceNameProvider,
    ) {}

    public getServiceConfigurator = (adbWrapper: AdbWrapper): ServiceConfigurator => {
        return new AndroidServiceConfigurator(
            adbWrapper,
            this.apkLocator,
            this.portFinder,
            this.friendlyDeviceNameProvider,
        );
    };
}
