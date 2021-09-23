// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
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
    win.loadFile('codecs.html');
});
