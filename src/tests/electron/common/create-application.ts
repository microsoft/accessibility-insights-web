// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import * as fs from 'fs';
import { Application } from 'spectron';

import { AppController } from './view-controllers/app-controller';

export interface AppOptions {
    suppressFirstTimeDialog: boolean;
}

export async function createApplication(options?: AppOptions): Promise<AppController> {
    const electronPath = `${
        (global as any).rootDir
    }/drop/electron/unified-dev/product/bundle/main.bundle.js`;
    const electronLocal = `${(global as any).rootDir}/drop/electron-local/electron.exe`;

    const app = new Application({
        path: fs.existsSync(electronLocal) ? electronLocal : (Electron as any),
        args: [electronPath],
        // connectionRetryCount * connectionRetryTimeout should be less than DEFAULT_ELECTRON_TEST_TIMEOUT_MS
        connectionRetryCount: 3,
        connectionRetryTimeout: 5000,
    });

    await app.start();

    const appController = new AppController(app);

    if (options?.suppressFirstTimeDialog === true) {
        await appController.setTelemetryState(false);
    }

    return appController;
}
