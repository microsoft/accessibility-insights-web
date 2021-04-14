// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';

export class AndroidPortCleaner {
    private serviceConfig: ServiceConfigurator;
    private readonly forwardedPorts: Set<number> = new Set<number>();

    constructor(private readonly logger: Logger) {}

    public setServiceConfig = (serviceConfig: ServiceConfigurator): void => {
        this.serviceConfig = serviceConfig;
    };

    public addPort = (hostPort: number): void => {
        this.forwardedPorts.add(hostPort);
    };

    public removePort = (hostPort: number): void => {
        this.forwardedPorts.delete(hostPort);
    };

    public removeRemainingPorts = async (): Promise<void> => {
        if (!this.serviceConfig) {
            return;
        }

        const ports = this.forwardedPorts.values();
        for (const p of ports) {
            if (p) {
                try {
                    await this.serviceConfig.removeTcpForwarding(p);
                } catch (error) {
                    this.logger.log(error);
                }
            }
        }
    };
}
