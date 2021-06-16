// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { PortCleaningServiceConfigurator } from 'electron/platform/android/setup/port-cleaning-service-configurator';

export class PortCleaningServiceConfiguratorFactory implements ServiceConfiguratorFactory {
    constructor(
        private readonly innerFactory: ServiceConfiguratorFactory,
        private readonly androidPortCleaner: AndroidPortCleaner,
    ) {}

    public getServiceConfigurator = (adbWrapper: AdbWrapper): ServiceConfigurator => {
        const serviceConfig: ServiceConfigurator =
            this.innerFactory.getServiceConfigurator(adbWrapper);
        const portCleaningServiceConfig = new PortCleaningServiceConfigurator(
            serviceConfig,
            this.androidPortCleaner,
        );
        this.androidPortCleaner.setServiceConfig(portCleaningServiceConfig);
        return portCleaningServiceConfig;
    };
}
