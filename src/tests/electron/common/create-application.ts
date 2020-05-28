// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { Application } from 'spectron';

import {
    DEFAULT_APP_CONNECT_RETRIES,
    DEFAULT_APP_CONNECT_TIMEOUT_MS,
} from 'tests/electron/setup/timeouts';
import { AppController } from './view-controllers/app-controller';

export interface AppOptions {
    suppressFirstTimeDialog: boolean;
}

export async function createApplication(options?: AppOptions): Promise<AppController> {
    const targetApp = `${
        (global as any).rootDir
    }/drop/electron/unified-dev/product/bundle/main.bundle.js`;

    const appController = await createAppController(targetApp);

    if (options?.suppressFirstTimeDialog === true) {
        await appController.setTelemetryState(false);
    }

    return appController;
}

export async function createAppController(targetApp: string): Promise<AppController> {
    const app = new Application({
        path: Electron as any,
        args: [targetApp],
        connectionRetryCount: DEFAULT_APP_CONNECT_RETRIES,
        connectionRetryTimeout: DEFAULT_APP_CONNECT_TIMEOUT_MS,
    });
    await app.start();
    return new AppController(app);
}
