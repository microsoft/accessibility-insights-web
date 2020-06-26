// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { DictionaryStringTo } from 'types/common-types';

export class AndroidPortCleaner {
    private serviceConfig: ServiceConfigurator;
    private readonly portMap: DictionaryStringTo<number> = {};

    constructor(
        private readonly ipcRendererShim: IpcRendererShim,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.ipcRendererShim.fromBrowserWindowClose.addListener(this.removeRemainingPorts);
    }

    public setServiceConfig = (serviceConfig: ServiceConfigurator): void => {
        this.serviceConfig = serviceConfig;
    };

    public addPort = (hostPort: number): void => {
        this.portMap[hostPort.toString()] = hostPort;
    };

    public removePort = (hostPort: number): void => {
        const portMapKey: string = hostPort.toString();
        delete this.portMap[portMapKey];
    };

    private removeRemainingPorts = async (): Promise<void> => {
        if (this.serviceConfig) {
            const ports = Object.values(this.portMap);
            for (const p of ports) {
                if (p) {
                    try {
                        await this.serviceConfig.removeTcpForwarding(p);
                        await this.serviceConfig.listForwardedPorts(); // Allows ADB to complete
                    } catch (error) {
                        this.logger.log(error);
                    }
                }
            }
        }
    };
}
