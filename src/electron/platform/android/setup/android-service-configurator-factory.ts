// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import {
    AndroidServiceConfigurator,
    LiveAndroidServiceConfigurator,
} from 'electron/platform/android/setup/android-service-configurator';

export interface AndroidServiceSetupBusinessLogicFactory {
    getBusinessLogic(adbLocation: string): Promise<AndroidServiceConfigurator>;
}

export class LiveAndroidServiceSetupBusinessLogicFactory {
    constructor(
        private readonly serviceConfiguratorFactory: AdbWrapperFactory,
        private readonly apkLocator: AndroidServiceApkLocator,
    ) {}

    public getBusinessLogic = async (adbLocation: string): Promise<AndroidServiceConfigurator> => {
        const configurator = await this.serviceConfiguratorFactory.getServiceConfigurator(
            adbLocation,
        );
        return new LiveAndroidServiceConfigurator(configurator, this.apkLocator);
    };
}
