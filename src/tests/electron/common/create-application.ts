// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { _electron as electron } from 'playwright';

import { AppController } from './view-controllers/app-controller';

export async function createApplication(options?: any): Promise<AppController> {
    const targetApp = `${
        (global as any).rootDir
    }/drop/electron/unified-dev/product/bundle/main.bundle.js`;

    const unifiedOptions = {
        ...options,
        env: {
            ANDROID_HOME: `${(global as any).rootDir}/drop/mock-adb`,
            DEV_MODE: true,
            ...process.env,
            ...options.env,
        },
    };

    const appController = await createAppController(targetApp, unifiedOptions);

    if (options?.suppressFirstTimeDialog === true) {
        await appController.setTelemetryState(false);
    }

    return appController;
}
export async function createAppController(
    targetApp: string,
    options?: any,
): Promise<AppController> {
    const app = await electron.launch({
        args: [targetApp],
        env: options.env,
        path: Electron,
        bypassCSP: true,
    });
    const client = await app.firstWindow();
    await client.reload();

    return new AppController(app, client);
}
