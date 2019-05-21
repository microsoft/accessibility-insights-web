// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { fromBackgroundChannel, fromDetailsViewChannel } from './communication-channel';

let detailsViewWindow: BrowserWindow;

const createDetailsViewWindow = () => {
    detailsViewWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });

    const detailsViewPath = join(__dirname, '../DetailsView/detailsView.html');

    detailsViewWindow.loadFile(detailsViewPath).catch(console.log);

    detailsViewWindow.on('ready-to-show', () => {
        detailsViewWindow.maximize();
        detailsViewWindow.show();

        detailsViewWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

let backgroundWindow: BrowserWindow;

const createBackgroundWindow = () => {
    backgroundWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });

    const backgroundPath = join(__dirname, '../background/background.html');

    backgroundWindow.loadFile(backgroundPath).catch(console.log);

    backgroundWindow.on('ready-to-show', () => {
        backgroundWindow.maximize();
        backgroundWindow.show();

        backgroundWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

const setupCommunication = () => {
    ipcMain.on(fromDetailsViewChannel, (event, ...args) => {
        console.log('on main', { channel: fromDetailsViewChannel, argsZero: args[0] });
        backgroundWindow.webContents.send(fromDetailsViewChannel, args);
    });
    ipcMain.on(fromBackgroundChannel, (event, ...args) => {
        console.log('on main', { channel: fromBackgroundChannel, argsZero: args[0] });
        detailsViewWindow.webContents.send(fromBackgroundChannel, args);
    });
};

app.on('ready', () => {
    createBackgroundWindow();
    createDetailsViewWindow();
    setupCommunication();
});
