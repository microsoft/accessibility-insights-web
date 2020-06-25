// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';

export class AndroidPortCleaner {
    private serviceConfig: AndroidServiceConfigurator;

    constructor(private readonly ipcRendererShim: IpcRendererShim) {}

    public closeWindow = async (): Promise<void> => {
        if (this.serviceConfig) {
            await this.serviceConfig.removeAllTcpForwarding();
        }

        this.ipcRendererShim.closeWindow();
    };

    public setServiceConfig = (serviceConfig: AndroidServiceConfigurator): void => {
        this.serviceConfig = serviceConfig;
    };
}
