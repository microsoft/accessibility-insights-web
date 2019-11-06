// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { Application } from 'spectron';
import { AppController } from './view-controllers/app-controller';

export async function createApplication(): Promise<AppController> {
    const electronPath = `${(global as any).rootDir}/drop/electron/electron/product/bundle/main.bundle.js`;
    const app = new Application({
        path: Electron as any,
        args: [electronPath],
    });

    await app.start();

    return new AppController(app);
}
