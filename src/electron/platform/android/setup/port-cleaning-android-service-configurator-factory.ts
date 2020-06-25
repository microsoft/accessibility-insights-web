// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';

export class PortCleaningAndroidServiceConfiguratorFactory implements ServiceConfiguratorFactory {
    constructor(
        private readonly innerFactory: ServiceConfiguratorFactory,
        private readonly androidPortCleaner: AndroidPortCleaner,
    ) {}

    public getServiceConfigurator = async (
        adbLocation: string,
    ): Promise<AndroidServiceConfigurator> => {
        const serviceConfig: AndroidServiceConfigurator = await this.innerFactory.getServiceConfigurator(
            adbLocation,
        );
        this.androidPortCleaner.setServiceConfig(serviceConfig);
        return serviceConfig;
    };
}
