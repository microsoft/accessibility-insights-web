// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppUpdater, Logger } from 'electron-updater';

export class AutoUpdaterClient {
    constructor(private readonly autoUpdater: AppUpdater, log: Logger) {
        autoUpdater.logger = log;
    }

    public check = async () => {
        return await this.autoUpdater.checkForUpdatesAndNotify();
    };
}
