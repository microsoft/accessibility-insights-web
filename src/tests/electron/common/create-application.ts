// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { _electron as electron } from 'playwright';
import { AppController } from './view-controllers/app-controller';
export interface AppOptions {
    suppressFirstTimeDialog: boolean;
    env?: {
        ANDROID_HOME?: string;
        DISPLAY?: any;
    };
}

export async function createApplication(options?: AppOptions): Promise<AppController> {
    const targetApp = `${
        (global as any).rootDir
    }/drop/electron/unified-dev/product/bundle/main.bundle.js`;

    if (process.env.DISPLAY) {
        if (!options) {
            options = { suppressFirstTimeDialog: false, env: {} };
        }
        if (!options.env) {
            options.env = {};
        }
        options.env.DISPLAY = process.env.DISPLAY;
    }

    const unifiedOptions = {
        ...options,
        env: {
            ANDROID_HOME: `${(global as any).rootDir}/drop/mock-adb`,
            ACCESSIBILITY_INSIGHTS_ELECTRON_CLEAR_DATA: 'true',
            ACCESSIBILITY_INSIGHTS_ELECTRON_LINUX_TESTS: 'true',
            ...options.env,
        },
    };

    const appController = await createAppController(targetApp, unifiedOptions);
    await appController.initialize();

    if (options?.suppressFirstTimeDialog === true) {
        await appController.setTelemetryState(false);
    }

    return appController;
}
export async function createAppController(
    targetApp: string,
    options?: Partial<AppOptions>,
): Promise<AppController> {
    const app = await electron.launch({
        args: ['--enable-logging', '--ignore_gpu_blacklist', '--disable_splash_screen', targetApp],
        env: options.env,
        path: Electron,
        bypassCSP: true, //allow injecting axe despite privacy headers
    });

    return new AppController(app);
}
