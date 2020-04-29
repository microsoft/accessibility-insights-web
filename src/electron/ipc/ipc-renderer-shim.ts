// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { IpcRenderer } from 'electron';
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
    IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
} from 'electron/ipc/ipc-channel-names';

export class IpcRendererShim {
    public constructor(private readonly ipcRenderer: IpcRenderer) {}

    private readonly invokeScope: string = 'IpcRendererShim';

    public initialize(): void {
        this.ipcRenderer.on(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, this.onMaximize);
        this.ipcRenderer.on(IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, this.onUnmaximize);
        this.ipcRenderer.on(IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME, this.onEnterFullScreen);
    }

    private onMaximize = (): void => {
        this.maximizeEvent.invoke(null, this.invokeScope);
    };

    private onEnterFullScreen = (): void => {
        this.enterFullScreenEvent.invoke(null, this.invokeScope);
    };

    private onUnmaximize = (): void => {
        this.unmaximizeEvent.invoke(null, this.invokeScope);
    };

    // Listen to these events to receive data sent TO renderer process
    public readonly maximizeEvent = new Action<void>();
    public readonly unmaximizeEvent = new Action<void>();
    public readonly enterFullScreenEvent = new Action<void>();

    // Call these methods to send data FROM renderer process
    public initializeWindow = (): void => {
        this.ipcRenderer.send(IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME);
    };

    public getVersion = (): string => {
        return this.ipcRenderer.sendSync(IPC_APP_VERSION_CHANNEL_NAME);
    };

    public maximizeWindow = (): void => {
        this.ipcRenderer.send(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME);
    };

    public minimizeWindow = (): void => {
        this.ipcRenderer.send(IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME);
    };

    public restoreWindow = (): void => {
        this.ipcRenderer.send(IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME);
    };

    public closeWindow = (): void => {
        this.ipcRenderer.send(IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME);
    };

    public setSizeAndCenterWindow = (sizePayload: SetSizePayload): void => {
        this.ipcRenderer.send(IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME, sizePayload);
    };
}
