// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { PortCleaningServiceConfigurator } from 'electron/platform/android/setup/port-cleaning-service-configurator';

export class PortCleaningServiceConfiguratorFactory implements ServiceConfiguratorFactory {
    constructor(
        private readonly innerFactory: ServiceConfiguratorFactory,
        private readonly androidPortCleaner: AndroidPortCleaner,
    ) {}

    public getServiceConfigurator = async (adbLocation: string): Promise<ServiceConfigurator> => {
        const serviceConfig: ServiceConfigurator = await this.innerFactory.getServiceConfigurator(
            adbLocation,
        );
        const portCleaningServiceConfig = new PortCleaningServiceConfigurator(
            serviceConfig,
            this.androidPortCleaner,
        );
        this.androidPortCleaner.setServiceConfig(portCleaningServiceConfig);
        return portCleaningServiceConfig;
    };
}
