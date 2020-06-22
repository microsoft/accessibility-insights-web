// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';

export class AndroidServiceConfiguratorFactory {
    constructor(
        private readonly serviceConfiguratorFactory: AdbWrapperFactory,
        private readonly apkLocator: AndroidServiceApkLocator,
    ) {}

    public getBusinessLogic = async (adbLocation: string): Promise<AndroidServiceConfigurator> => {
        const configurator = await this.serviceConfiguratorFactory.getServiceConfigurator(
            adbLocation,
        );
        return new AndroidServiceConfigurator(configurator, this.apkLocator);
    };
}
