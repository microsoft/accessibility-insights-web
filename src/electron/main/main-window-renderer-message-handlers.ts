// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { App, BrowserWindow, IpcMain, IpcMainEvent } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_VERSION_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
} from 'electron/ipc/ipc-channel-names';

type EventCallback = {
    eventName: string;
    eventHandler: (event: IpcMainEvent, ...args: any[]) => void;
};

export class MainWindowRendererMessageHandlers {
    private ipcMainCallbacks: EventCallback[];
    private browserWindowCallbacks: EventCallback[];

    public constructor(
        private readonly app: App,
        private readonly browserWindow: BrowserWindow,
        private readonly ipcMain: IpcMain,
    ) {}

    private populateCallbacks(): void {
        this.ipcMainCallbacks = [
            {
                eventName: IPC_FROMRENDERER_GET_APP_VERSION_CHANNEL_NAME,
                eventHandler: this.onGetVersionFromRenderer,
            },
            {
                eventName: IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
                eventHandler: this.onMaximizeFromRenderer,
            },
            {
                eventName: IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
                eventHandler: this.onMinimizeFromRenderer,
            },
            {
                eventName: IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
                eventHandler: this.onRestoreFromRenderer,
            },
            {
                eventName: IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
                eventHandler: this.onCloseMessageFromRenderer,
            },
            {
                eventName: IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
                eventHandler: this.onSetSizeAndCenterFromRenderer,
            },
        ];

        this.browserWindowCallbacks = [
            { eventName: 'maximize', eventHandler: this.onMaximizeFromMainWindow },
            { eventName: 'unmaximize', eventHandler: this.onUnmaximizeFromMainWindow },
            { eventName: 'enter-full-screen', eventHandler: this.onEnterFullScreenFromMainWindow },
            { eventName: 'leave-full-screen', eventHandler: this.onLeaveFullScreenFromMainWindow },
        ];
    }

    public startListening(): void {
        this.populateCallbacks();

        this.ipcMainCallbacks.forEach(callback => {
            this.ipcMain.on(callback.eventName, callback.eventHandler);
        });

        this.browserWindowCallbacks.forEach(callback => {
            this.browserWindow.on(callback.eventName as any, callback.eventHandler);
        });
    }

    public stopListening(): void {
        this.ipcMainCallbacks.forEach(callback => {
            this.ipcMain.removeListener(callback.eventName, callback.eventHandler);
        });

        this.browserWindowCallbacks.forEach(callback => {
            this.browserWindow.removeListener(callback.eventName as any, callback.eventHandler);
        });
    }

    private onGetVersionFromRenderer = (event: IpcMainEvent): void => {
        event.returnValue = this.app.getVersion();
    };

    private onMaximizeFromRenderer = (): void => {
        this.browserWindow.maximize();
    };

    private onMinimizeFromRenderer = (): void => {
        this.browserWindow.minimize();
    };

    private onRestoreFromRenderer = (): void => {
        if (this.browserWindow.isFullScreen()) {
            this.browserWindow.setFullScreen(false);
        } else {
            this.browserWindow.unmaximize();
        }
    };

    private onCloseMessageFromRenderer = (): void => {
        this.browserWindow.close();
    };

    private onSetSizeAndCenterFromRenderer = (event: IpcMainEvent, args: SetSizePayload): void => {
        this.browserWindow.setSize(args.width, args.height);
        this.browserWindow.center();
    };

    private onMaximizeFromMainWindow = (): void => {
        this.browserWindow.webContents.send(IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME);
    };

    private onUnmaximizeFromMainWindow = (): void => {
        this.browserWindow.webContents.send(IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME);
    };

    private onEnterFullScreenFromMainWindow = (): void => {
        this.browserWindow.webContents.send(IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME);
    };

    private onLeaveFullScreenFromMainWindow = (): void => {
        if (this.browserWindow.isMaximized()) {
            this.onMaximizeFromMainWindow();
        } else {
            this.onUnmaximizeFromMainWindow();
        }
    };
}
