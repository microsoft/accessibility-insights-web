// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { App, BrowserWindow, IpcMain, IpcMainEvent } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_APP_VERSION_CHANNEL_NAME,
    IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME,
    IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
} from 'electron/ipc/ipc-channel-names';

export class MainWindowRendererMessageHandlers {
    public constructor(
        private readonly app: App,
        private readonly mainWindow: BrowserWindow,
        private readonly ipcMain: IpcMain,
    ) {}

    public startListening(): void {
        this.ipcMain.on(IPC_APP_VERSION_CHANNEL_NAME, this.onGetVersionMessage);
        this.ipcMain.on(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, this.onMaximizeMessage);
        this.ipcMain.on(IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME, this.onMinimizeMessage);
        this.ipcMain.on(IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME, this.onRestoreMessage);
        this.ipcMain.on(IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME, this.onCloseMessage);
        this.ipcMain.on(
            IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME,
            this.onSetSizeAndCenterMessage,
        );
        this.mainWindow.on('maximize', this.onMaximizeEvent);
        this.mainWindow.on('unmaximize', this.onUnmaximizeEvent);
        this.mainWindow.on('enter-full-screen', this.onEnterFullScreenEvent);
        this.mainWindow.on('leave-full-screen', this.onLeaveFullScreenEvent);
    }

    public stopListening(): void {
        this.ipcMain.removeListener(IPC_APP_VERSION_CHANNEL_NAME, this.onGetVersionMessage);
        this.ipcMain.removeListener(
            IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
            this.onMaximizeMessage,
        );
        this.ipcMain.removeListener(
            IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME,
            this.onMinimizeMessage,
        );
        this.ipcMain.removeListener(IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME, this.onRestoreMessage);
        this.ipcMain.removeListener(IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME, this.onCloseMessage);
        this.ipcMain.removeListener(
            IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME,
            this.onSetSizeAndCenterMessage,
        );
        this.mainWindow.removeListener('maximize', this.onMaximizeEvent);
        this.mainWindow.removeListener('unmaximize', this.onUnmaximizeEvent);
        this.mainWindow.removeListener('enter-full-screen', this.onEnterFullScreenEvent);
        this.mainWindow.removeListener('leave-full-screen', this.onLeaveFullScreenEvent);
    }

    private onGetVersionMessage = (event: IpcMainEvent): void => {
        event.returnValue = this.app.getVersion();
    };

    private onMaximizeMessage = (): void => {
        this.mainWindow.maximize();
    };

    private onMinimizeMessage = (): void => {
        this.mainWindow.minimize();
    };

    private onRestoreMessage = (): void => {
        if (this.mainWindow.isFullScreen()) {
            this.mainWindow.setFullScreen(false);
        } else {
            this.mainWindow.unmaximize();
        }
    };

    private onCloseMessage = (): void => {
        this.mainWindow.close();
    };

    private onSetSizeAndCenterMessage = (event: IpcMainEvent, args: SetSizePayload): void => {
        this.mainWindow.setSize(args.width, args.height);
        this.mainWindow.center();
    };

    private onMaximizeEvent = (): void => {
        this.mainWindow.webContents.send(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME);
    };

    private onUnmaximizeEvent = (): void => {
        this.mainWindow.webContents.send(IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME);
    };

    private onEnterFullScreenEvent = (): void => {
        this.mainWindow.webContents.send(IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME);
    };

    private onLeaveFullScreenEvent = (): void => {
        if (this.mainWindow.isMaximized()) {
            this.onMaximizeEvent();
        } else {
            this.onUnmaximizeEvent();
        }
    };
}
