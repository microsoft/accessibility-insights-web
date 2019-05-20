// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';
import { join } from 'path';

const createDetailsViewWindow = () => {
    const mainWindow = new BrowserWindow({ show: false });

    const mainPath = join(__dirname, '../electron/main/main.html');

    mainWindow.loadFile(mainPath).catch(console.log);

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();

        mainWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

const createBackgroundWindow = () => {
    const backgroundWindow = new BrowserWindow({ show: false });

    const backgroundPath = join(__dirname, '../background/background.html');

    backgroundWindow.loadFile(backgroundPath).catch(console.log);

    backgroundWindow.on('ready-to-show', () => {
        backgroundWindow.maximize();
        backgroundWindow.show();

        backgroundWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

app.on('ready', () => {
    createBackgroundWindow();
    createDetailsViewWindow();
});
