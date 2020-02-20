// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileSystemConfiguration } from 'common/configuration/file-system-configuration';
import { app, BrowserWindow, NativeTheme } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { AutoUpdaterClient } from 'electron/auto-update/auto-updater-client';
import { getElectronIconPath } from 'electron/common/get-electron-icon-path';
import { OSType, PlatformInfo } from 'electron/window-management/platform-info';
import * as path from 'path';
import { mainWindowConfig } from './main-window-config';

export class NativeThemeListener {
    constructor(
        private readonly nativeTheme: NativeTheme,
        private readonly onHighContrastModeChanged,
    ) {}

    private onNativeThemeUpdated = () => {
        if (this.nativeTheme.shouldUseHighContrastColors)
    };

    public startListening(): void {
        this.nativeTheme.on('updated', this.onNativeThemeUpdated);
        this.onNativeThemeUpdated();
    }

    public stopListening(): void {}
}
let mainWindow: BrowserWindow;
const platformInfo = new PlatformInfo(process);
const os = platformInfo.getOs();
const config = new FileSystemConfiguration();

log.transports.file.level = 'info';
autoUpdater.logger = log;

let recurringUpdateCheck;
const electronAutoUpdateCheck = new AutoUpdaterClient(autoUpdater);

const createWindow = () => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true },
        titleBarStyle: 'hidden',
        width: mainWindowConfig.defaultWidth,
        height: mainWindowConfig.defaultHeight,
        frame: os === OSType.Mac,
        minHeight: mainWindowConfig.minHeight,
        minWidth: mainWindowConfig.minWidth,
        icon: getElectronIconPath(config, os),
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
