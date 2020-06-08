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
    public createADB = async (parameters: AdbCreateParameters): Promise<ADB> => {
        return ADB.createADB(parameters);
    };
}

export class AppiumServiceConfiguratorFactory implements AndroidServiceConfiguratorFactory {
    private readonly adbCreator: AdbCreator;

    public constructor(adbCreator: AdbCreator) {
        // In Production, pass null for adbCreator
        this.adbCreator = adbCreator ?? new ProductionAdbCreator();
    }

    public getServiceConfigurator = async (
        sdkRoot: string,
    ): Promise<AndroidServiceConfigurator> => {
        let parameters: AdbCreateParameters = undefined;
        if (sdkRoot) {
            parameters = { sdkRoot };
        }

        const adb: ADB = await this.adbCreator.createADB(parameters);

        return new AppiumServiceConfigurator(adb);
    };
}
