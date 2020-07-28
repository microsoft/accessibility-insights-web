// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Rectangle } from 'electron';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';

export class WindowFrameUpdater {
    constructor(
        private readonly windowFrameActions: WindowFrameActions,
        private readonly ipcRendererShim: IpcRendererShim,
    ) {}

    public initialize(): void {
        this.windowFrameActions.enterFullScreen.addListener(this.onEnterFullScreen);
        this.windowFrameActions.maximize.addListener(this.onMaximize);
        this.windowFrameActions.minimize.addListener(this.onMinimize);
        this.windowFrameActions.restore.addListener(this.onRestore);
        this.windowFrameActions.close.addListener(this.onClose);
        this.windowFrameActions.setWindowSize.addListener(this.onSetSize);
        this.windowFrameActions.setWindowBounds.addListener(this.onSetWindowBounds);
    }

    private onEnterFullScreen = (): void => {
        this.ipcRendererShim.enterFullScreen();
    };

    private onMaximize = (): void => {
        this.ipcRendererShim.maximizeWindow();
    };

    private onMinimize = (): void => {
        this.ipcRendererShim.minimizeWindow();
    };

    private onRestore = (): void => {
        this.ipcRendererShim.restoreWindow();
    };

    private onClose = (): void => {
        this.ipcRendererShim.closeWindow();
    };

    private onSetSize = (sizePayload: SetSizePayload): void => {
        this.ipcRendererShim.setSizeAndCenterWindow(sizePayload);
    };

    private onSetWindowBounds = (windowBounds: Rectangle): void => {
        this.ipcRendererShim.setWindowBounds(windowBounds);
    };
}
