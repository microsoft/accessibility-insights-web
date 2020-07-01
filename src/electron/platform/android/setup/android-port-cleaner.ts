// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';

export class AndroidPortCleaner {
    private serviceConfig: ServiceConfigurator;
    private readonly forwardedPorts: Set<number> = new Set<number>();

    constructor(
        private readonly ipcRendererShim: IpcRendererShim,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.ipcRendererShim.fromBrowserWindowClose.addAsyncListener(this.removeRemainingPorts);
    }

    public setServiceConfig = (serviceConfig: ServiceConfigurator): void => {
        this.serviceConfig = serviceConfig;
    };

    public addPort = (hostPort: number): void => {
        this.forwardedPorts.add(hostPort);
    };

    public removePort = (hostPort: number): void => {
        this.forwardedPorts.delete(hostPort);
    };

    private removeRemainingPorts = async (): Promise<void> => {
        if (this.serviceConfig) {
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
        }
    };
}
