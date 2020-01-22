// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import * as fs from 'fs';
import { Application } from 'spectron';

import { AppController } from './view-controllers/app-controller';

export async function createApplication(): Promise<AppController> {
    const electronPath = `${(global as any).rootDir}/drop/electron/electron/product/bundle/main.bundle.js`;
    const electronLocal = `${(global as any).rootDir}/drop/electron-local/electron.exe`;

    const app = new Application({
        path: fs.existsSync(electronLocal) ? electronLocal : (Electron as any),
        args: [electronPath],
        // chromeDriverLogPath: `${(global as any).rootDir}/test-results/e2e/`,
    });

    await app.start();

    return new AppController(app);
}
