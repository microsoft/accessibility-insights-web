// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { app, BrowserWindow } = require('electron');

void app.whenReady().then(async () => {
    const win = new BrowserWindow({
        webPreferences: {
            webgl: true,
            webSecurity: false,
            experimentalFeatures: true,
            experimentalCanvasFeatures: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    await win.loadFile('codecs.html');
});
