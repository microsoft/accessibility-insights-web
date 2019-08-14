// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true },
        frame: false,
        width: 600,
        height: 391,
    });

    mainWindow
        .loadFile(path.resolve(__dirname, '../electron/device-connect-view/deviceConnectView.html'))
        .then(() => console.log('url loaded'))
        .catch(console.log);

    mainWindow.on('ready-to-show', () => {
        mainWindow.setMenu(null);
        mainWindow.show();
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
};

app.on('ready', createWindow);
