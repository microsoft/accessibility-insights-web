// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
} from 'electron/platform/android/android-service-configurator';
import { AppiumServiceConfigurator } from 'electron/platform/android/appium-service-configurator';

export class AppiumServiceConfiguratorFactory implements AndroidServiceConfiguratorFactory {
    public async getServiceConfigurator(
        adbFileLocation: string,
    ): Promise<AndroidServiceConfigurator> {
        let adb: ADB;

        if (adbFileLocation) {
            adb = await ADB.createADB({ sdkRoot: adbFileLocation });
        } else {
            adb = await ADB.createADB();
        }

        return new AppiumServiceConfigurator(adb);
    }
}
