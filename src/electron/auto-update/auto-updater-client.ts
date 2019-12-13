// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import log from 'electron-log';

export class AutoUpdaterClient {
    constructor(private readonly autoUpdater) {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
    }

    public check = async () => {
        return await this.autoUpdater.checkForUpdatesAndNotify();
    };
}
