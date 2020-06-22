// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
} from 'electron/platform/android/adb-wrapper';
import {
    AppiumAdbCreateParameters,
    AppiumAdbCreator,
} from 'electron/platform/android/appium-adb-creator';
import { AppiumServiceConfigurator } from 'electron/platform/android/appium-adb-wrapper';

export class AppiumServiceConfiguratorFactory implements AndroidServiceConfiguratorFactory {
    public constructor(private readonly adbCreator: AppiumAdbCreator) {}

    public getServiceConfigurator = async (
        sdkRoot: string,
    ): Promise<AndroidServiceConfigurator> => {
        const parameters: AppiumAdbCreateParameters = sdkRoot
            ? {
                  sdkRoot,
              }
            : undefined;

        const adb: ADB = await this.adbCreator.createADB(parameters);

        return new AppiumServiceConfigurator(adb);
    };
}
