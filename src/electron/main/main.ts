// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({ show: false });

    const mainPath = join(__dirname, '../electron/main/main.html');

    mainWindow
        .loadFile(mainPath)
        .then(() => console.log('url loaded'))
        .catch(console.log);

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();

        mainWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

app.on('ready', createWindow);
