// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Electron from 'electron';
import { Application } from 'spectron';

export function createApplication(): Promise<Application> {
    const electronPath = `${(global as any).rootDir}/drop/electron/extension/bundle/main.bundle.js`;
    const app = new Application({
        path: Electron as any,
        args: [electronPath],
    });

    return app.start();
}
