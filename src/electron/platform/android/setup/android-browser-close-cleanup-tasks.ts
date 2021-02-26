// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';

export class AndroidBrowserCloseCleanupTasks {
    constructor(
        private readonly ipcRendererShim: IpcRendererShim,
        private readonly deviceFocusController: DeviceFocusController,
        private readonly androidPortCleaner: AndroidPortCleaner,
        private readonly logger: Logger,
    ) {}

    public addBrowserCloseListener(): void {
        this.ipcRendererShim.fromBrowserWindowClose.addAsyncListener(this.executeCleanupTasks);
    }

    private executeCleanupTasks = async () => {
        try {
            await this.deviceFocusController.disableFocusTracking();
        } catch (error) {
            this.logger.log(error);
        }

        await this.disconnectDevice();
    };

    private disconnectDevice = async () => {
        try {
            await this.androidPortCleaner.removeRemainingPorts();
        } catch (error) {
            this.logger.log(error);
        }
    };
}
