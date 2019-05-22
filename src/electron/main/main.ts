// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
    fromBackgroundChannel,
    fromDetailsViewChannel,
    injectCssChannel,
    injectJsChannel,
    jsInjectionCompleted,
} from './communication-channel';

type WindowBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const defaultBounds: WindowBounds = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
};

let detailsViewWindow: BrowserWindow;

const createDetailsViewWindow = (windowBounds: WindowBounds = defaultBounds) => {
    detailsViewWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true }, ...windowBounds });

    const detailsViewPath = join(__dirname, '../DetailsView/detailsView.html');

    detailsViewWindow.loadFile(detailsViewPath).catch(console.log);

    detailsViewWindow.on('ready-to-show', () => {
        detailsViewWindow.show();

        detailsViewWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

let backgroundWindow: BrowserWindow;

const createBackgroundWindow = (windowBounds: WindowBounds = defaultBounds) => {
    backgroundWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true }, ...windowBounds });

    const backgroundPath = join(__dirname, '../background/background.html');

    backgroundWindow.loadFile(backgroundPath).catch(console.log);

    backgroundWindow.on('ready-to-show', () => {
        backgroundWindow.show();

        backgroundWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

let targetPageWindow: BrowserWindow;

const createTargetPageWindow = (windowBounds: WindowBounds = defaultBounds) => {
    targetPageWindow = new BrowserWindow({ show: false, ...windowBounds, webPreferences: { nodeIntegration: true, webSecurity: false } });

    const targetPageUrl = 'https://ada-cat.github.io/AU/before.html';

    targetPageWindow.loadURL(targetPageUrl).catch(console.log);

    targetPageWindow.on('ready-to-show', () => {
        targetPageWindow.show();

        targetPageWindow.webContents.openDevTools({ mode: 'bottom' });
    });
};

const setupCommunication = () => {
    ipcMain.on(fromDetailsViewChannel, (event, ...args) => {
        backgroundWindow.webContents.send(fromDetailsViewChannel, args);
    });

    ipcMain.on(fromBackgroundChannel, (event, ...args) => {
        // TODO send args[0] instead of args ??
        detailsViewWindow.webContents.send(fromBackgroundChannel, args);
        targetPageWindow.webContents.send(fromBackgroundChannel, args);
    });

    ipcMain.on(injectJsChannel, (event, filepath) => {
        const relativePath = join(__dirname, '..', filepath);
        const jsBuffer = readFileSync(relativePath);
        const jsContent = jsBuffer.toString();

        targetPageWindow.webContents.executeJavaScript(jsContent);
        event.reply(jsInjectionCompleted);
    });

    ipcMain.on(injectCssChannel, (event, filepath) => {
        const relativePath = join(__dirname, '..', filepath);
        const csssBuffer = readFileSync(relativePath);
        const cssContent = csssBuffer.toString();

        targetPageWindow.webContents.insertCSS(cssContent);
    });
};

app.on('ready', () => {
    const displays = screen.getAllDisplays();

    const firstDisplay = displays[0];

    const fullWidth = firstDisplay.workAreaSize.width;
    const fullHeight = firstDisplay.workAreaSize.height;

    const portion = 2;

    const fractionWidth = Math.floor(fullWidth / portion);

    const targetPageBounds: WindowBounds = {
        x: 0,
        y: 0,
        height: fullHeight,
        width: fractionWidth,
    };

    const detailsViewBounds: WindowBounds = {
        x: fractionWidth,
        y: 0,
        height: fullHeight,
        width: Math.ceil(fullWidth - fractionWidth),
    };

    createBackgroundWindow();
    createDetailsViewWindow(detailsViewBounds);
    createTargetPageWindow(targetPageBounds);

    setupCommunication();
});
