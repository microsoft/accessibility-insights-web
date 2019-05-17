// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({ show: false });

    mainWindow.loadURL('https://ada-cat.github.io/AU/before.html');

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();

        mainWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

app.on('ready', createWindow);
