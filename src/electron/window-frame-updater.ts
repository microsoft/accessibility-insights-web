// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameUpdater {
    constructor(private readonly windowFrameActions: WindowFrameActions, private readonly browserWindow: BrowserWindow) {}

    public initialize(): void {
        this.windowFrameActions.maximize.addListener(this.onMaximize);
        this.windowFrameActions.minimize.addListener(this.onMinimize);
        this.windowFrameActions.restore.addListener(this.onRestore);
        this.windowFrameActions.close.addListener(this.onClose);
        this.windowFrameActions.setWindowSize.addListener(this.onSetSize);
    }

    private onMaximize = (): void => {
        this.browserWindow.maximize();
    };

    private onMinimize = (): void => {
        this.browserWindow.minimize();
    };

    private onRestore = (): void => {
        if (this.browserWindow.isFullScreen()) {
            this.browserWindow.setFullScreen(false);
        } else {
            this.browserWindow.unmaximize();
        }
    };

    private onClose = (): void => {
        this.browserWindow.close();
    };

    private onSetSize = (sizePayload: SetSizePayload): void => {
        this.browserWindow.setSize(sizePayload.width, sizePayload.height);
        this.browserWindow.center();
    };
}
