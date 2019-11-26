// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class AutoUpdaterClient {
    constructor(private readonly autoUpdater) {}

    public check = async () => {
        return await this.autoUpdater.checkForUpdatesAndNotify();
    };
}
