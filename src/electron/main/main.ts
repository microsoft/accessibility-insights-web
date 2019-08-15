// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fetchScanResults } from '../platform/android/fetch-scan-results';

let mainWindow: BrowserWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });

    // These are just to test the connection and should later be removed.
    checkPort(48485);
    checkPort(48486);
    checkPort(48487);

    mainWindow
        .loadFile(path.resolve(__dirname, '../electron/device-connect-view/deviceConnectView.html'))
        .then(() => console.log('url loaded'))
        .catch(console.log);

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();

        mainWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

function checkPort(port: number): void {
    fetchScanResults(port)
        .then(data => {
            console.log(`Scanned port ${port}, found device ${data.deviceName} running ${data.appIdentifier}`);
        })
        .catch(error => {
            console.log(`Scanned port ${port}, received error ${error}`);
        });
}

app.on('ready', createWindow);
