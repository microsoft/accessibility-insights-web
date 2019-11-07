// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { download } from '@electron/get';

export async function downloadElectronGet(): Promise<string> {
    return await download('7.0.1', {
        mirrorOptions: {
            mirror: 'https://electron.blob.core.windows.net/builds/',
            customDir: '7.0.1/electron/3764120',
            customFilename: 'electron-v7.0.1-win32-x64.zip',
        },
    });
}

console.log(downloadElectronGet);
