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

    private executeCleanupTasks = async (): Promise<void> => {
        await this.resetFocusTracking();
        await this.disconnectDevice();
    };

    private resetFocusTracking = async (): Promise<void> => {
        try {
            await this.deviceFocusController.resetFocusTracking();
        } catch (error) {
            this.logger.log(error);
        }
    };

    private disconnectDevice = async (): Promise<void> => {
        try {
            await this.androidPortCleaner.removeRemainingPorts();
        } catch (error) {
            this.logger.log(error);
        }
    };
}
