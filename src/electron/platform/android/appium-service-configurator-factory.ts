// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
} from 'electron/platform/android/android-service-configurator';
import { AppiumServiceConfigurator } from 'electron/platform/android/appium-service-configurator';

export type AdbCreateParameters = {
    sdkRoot: string;
};

export interface AdbCreator {
    createADB(opts: AdbCreateParameters): Promise<ADB>;
}

class ProductionAdbCreator implements AdbCreator {
    public createADB = async (
        parameters: AdbCreateParameters,
    ): Promise<AndroidServiceConfigurator> => {
        return ADB.createADB(parameters);
    };
}

export class AppiumServiceConfiguratorFactory implements AndroidServiceConfiguratorFactory {
    public async getServiceConfigurator(sdkRoot: string): Promise<AndroidServiceConfigurator> {
        return this.getServiceConfiguratorTestable(sdkRoot, new ProductionAdbCreator());
    }

    public async getServiceConfiguratorTestable(
        sdkRoot: string,
        adbCreator: AdbCreator,
    ): Promise<AndroidServiceConfigurator> {
        let adb: ADB;

        let parameters: AdbCreateParameters = undefined;
        if (sdkRoot) {
            parameters = { sdkRoot };
        }

        adb = await adbCreator.createADB(parameters);

        return new AppiumServiceConfigurator(adb);
    }
}
