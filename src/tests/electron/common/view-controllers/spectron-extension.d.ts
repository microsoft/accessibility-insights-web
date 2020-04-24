// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
declare module 'spectron' {
    interface SpectronClient {
        // https://github.com/electron-userland/spectron/blob/cd733c4bc6b28eb5a1041ed79eef5563e75432ae/lib/api.js#L311
        browserWindow: SpectronWindow;
    }
}
