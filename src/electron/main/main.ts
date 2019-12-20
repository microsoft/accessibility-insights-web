// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { AutoUpdaterClient } from 'electron/auto-update/auto-updater-client';
import { OSType, PlatformInfo } from 'electron/window-management/platform-info';
import * as path from 'path';
import { verifySignatureOnLinux } from '../linux-sign-verify/linux-sign-verify';
import { mainWindowConfig } from './main-window-config';

let mainWindow: BrowserWindow;
const platformInfo = new PlatformInfo(process);

log.transports.file.level = 'info';
autoUpdater.logger = log;

autoUpdater.on('update-downloaded', (event, info: UpdateInfo) => {
    info.files.forEach(file => {});
    verifySignatureOnLinux('', '');
});

let recurringUpdateCheck;
const electronAutoUpdateCheck = new AutoUpdaterClient(autoUpdater);

const createWindow = () => {
    const os = platformInfo.getOs();
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true },
        titleBarStyle: 'hidden',
        width: mainWindowConfig.defaultWidth,
        height: mainWindowConfig.defaultHeight,
        frame: os === OSType.Mac,
        minHeight: mainWindowConfig.minHeight,
        minWidth: mainWindowConfig.minWidth,
        icon: path.resolve(__dirname, '../icons/brand/blue/brand-blue-512px.png'),
    });
    if (platformInfo.isMac()) {
        // We need this so that if there are any system dialog, they will not be placed on top of the title bar.
        mainWindow.setSheetOffset(22);
    }

    mainWindow
        .loadFile(path.resolve(__dirname, '../electron/views/index.html'))
        .then(() => console.log('url loaded'))
        .catch(console.log);

    mainWindow.on('ready-to-show', () => {
        mainWindow.setMenu(null);
        mainWindow.show();
        enableDevMode(mainWindow);
    });

    mainWindow.on('closed', () => {
        // Dereference the window object, to force garbage collection
        mainWindow = null;
    });

    electronAutoUpdateCheck
        .check()
        .then(() => {
            console.log('checked for updates');
            setupRecurringUpdateCheck();
        })
        .catch(console.log);
};

const enableDevMode = (window: BrowserWindow) => {
    if (process.env.DEV_MODE === 'true') {
        window.webContents.openDevTools({
            mode: 'detach',
        });
    }
};

const setupRecurringUpdateCheck = () => {
    recurringUpdateCheck = setInterval(async () => {
        await electronAutoUpdateCheck.check();
    }, 60 * 60 * 1000);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    clearInterval(recurringUpdateCheck);
    app.quit();
});
