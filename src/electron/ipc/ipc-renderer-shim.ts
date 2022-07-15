// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { SyncAction } from 'common/flux/sync-action';
import { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue, Rectangle } from 'electron';
import {
    SetSizePayload,
    WindowBoundsChangedPayload,
} from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_WINDOWBOUNDSCHANGED_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_FULL_SCREEN_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME,
    IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETWINDOWBOUNDS_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG,
} from 'electron/ipc/ipc-channel-names';

export class IpcRendererShim {
    public constructor(private readonly ipcRenderer: IpcRenderer) {}

    private readonly invokeScope: string = 'IpcRendererShim';

    public initialize(): void {
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, this.onMaximize);
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, this.onUnmaximize);
        this.ipcRenderer.on(
            IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
            this.onEnterFullScreen,
        );
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME, this.onClose);
        this.ipcRenderer.on(
            IPC_FROMBROWSERWINDOW_WINDOWBOUNDSCHANGED_CHANNEL_NAME,
            (_, windowBoundsPayload) => this.onWindowBoundsChanged(windowBoundsPayload),
        );
    }

    private onMaximize = (): void => {
        this.fromBrowserWindowMaximize.invoke(undefined, this.invokeScope);
    };

    private onEnterFullScreen = (): void => {
        this.fromBrowserWindowEnterFullScreen.invoke(undefined, this.invokeScope);
    };

    private onUnmaximize = (): void => {
        this.fromBrowserWindowUnmaximize.invoke(undefined, this.invokeScope);
    };

    private onClose = async (): Promise<void> => {
        await this.fromBrowserWindowClose.invoke(undefined);
        this.closeWindow();
    };

    private onWindowBoundsChanged = (payload: WindowBoundsChangedPayload): void => {
        this.fromBrowserWindowWindowBoundsChanged.invoke(payload, this.invokeScope);
    };

    // Listen to these events to receive data sent TO renderer process
    public readonly fromBrowserWindowClose = new AsyncAction();
    public readonly fromBrowserWindowMaximize = new SyncAction<void>();
    public readonly fromBrowserWindowUnmaximize = new SyncAction<void>();
    public readonly fromBrowserWindowEnterFullScreen = new SyncAction<void>();
    public readonly fromBrowserWindowWindowBoundsChanged =
        new SyncAction<WindowBoundsChangedPayload>();

    public getAppPath = async (): Promise<string> => {
        return await this.ipcRenderer.invoke(IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME);
    };

    public showOpenFileDialog = async (opts: OpenDialogOptions): Promise<OpenDialogReturnValue> => {
        return await this.ipcRenderer.invoke(IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG, opts);
    };

    // Call these methods to send data FROM renderer process
    public initializeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME);
    };

    public enterFullScreen = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_FULL_SCREEN_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public maximizeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public minimizeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public restoreWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public closeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME);
    };

    public setSizeAndCenterWindow = (sizePayload: SetSizePayload): void => {
        this.ipcRenderer.send(
            IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
            sizePayload,
        );
    };

    public setWindowBounds = (windowBounds: Rectangle): void => {
        this.ipcRenderer.send(
            IPC_FROMRENDERER_SETWINDOWBOUNDS_BROWSER_WINDOW_CHANNEL_NAME,
            windowBounds,
        );
    };
}
