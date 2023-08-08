// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
    fromBackgroundChannel,
    injectCssChannel,
    injectJsChannel,
    jsInjectionCompleted,
    toBackgroundChannel,
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
let backgroundWindow: BrowserWindow;
let targetPageWindow: BrowserWindow;

const createWindowAndLoadFile = (filepath: string, windowBounds: WindowBounds = defaultBounds): BrowserWindow => {
    const window = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true }, ...windowBounds });

    const path = join(__dirname, filepath);

    window.loadFile(path).catch(console.log);

    window.on('ready-to-show', window.show);

    return window;
};

const createWindowAndLoadUrl = (url: string, windowBounds: WindowBounds = defaultBounds): BrowserWindow => {
    const window = new BrowserWindow({ show: false, ...windowBounds, webPreferences: { nodeIntegration: true, webSecurity: false } });

    window.loadURL(url).catch(console.log);

    window.on('ready-to-show', window.show);

    return window;
};

const setupCommunication = () => {
    ipcMain.on(toBackgroundChannel, (event, ...args) => {
        backgroundWindow.webContents.send(toBackgroundChannel, args);
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

        targetPageWindow.webContents
            .executeJavaScript(jsContent)
            .then(() => event.reply(jsInjectionCompleted))
            .catch(console.log);
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

    backgroundWindow = createWindowAndLoadFile('../background/background.html');
    backgroundWindow.setTitle('background');
    backgroundWindow.webContents.openDevTools({ mode: 'bottom' });

    detailsViewWindow = createWindowAndLoadFile('../DetailsView/detailsView.html', detailsViewBounds);

    targetPageWindow = createWindowAndLoadUrl('https://ada-cat.github.io/AU/before.html', targetPageBounds);

    setupCommunication();
});
