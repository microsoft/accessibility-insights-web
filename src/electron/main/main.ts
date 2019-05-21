// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';

const fromBackgroundChannel = 'from-background';
const fromDetailsViewChannel = 'from-details-view';

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

    ipcMain.on(fromDetailsViewChannel, (event, ...args) => {
        console.log('on main', { channel: fromDetailsViewChannel, event, ...args });
        detailsViewWindow.webContents.send(fromDetailsViewChannel, args);
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

    ipcMain.on(fromBackgroundChannel, (event, ...args) => {
        console.log('on main', { channel: fromBackgroundChannel, event, ...args });
        backgroundWindow.webContents.send(fromBackgroundChannel, args);
    });
};

app.on('ready', () => {
    createBackgroundWindow();
    createDetailsViewWindow();
});
