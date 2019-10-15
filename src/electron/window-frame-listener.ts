// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateActionCreator } from './flux/action-creator/window-state-action-creator';

export class WindowFrameListener {
    constructor(private readonly windowStateActionsCreator: WindowStateActionCreator, private readonly browserWindow: BrowserWindow) {}

    public initialize(): void {
        this.browserWindow.on('maximize', this.onMaximize);
        this.browserWindow.on('unmaximize', this.onUnMaximize);
        this.browserWindow.on('enter-full-screen', this.onEnterFullScreen);
        this.browserWindow.on('leave-full-screen', this.onLeaveFullScreen);
    }
    private onMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'maximized' });
    };

    private onEnterFullScreen = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'fullScreen' });
    };
    private onLeaveFullScreen = (): void => {
        if (this.browserWindow.isMaximized()) {
            this.onMaximize();
        } else {
            this.onUnMaximize();
        }
    };
    private onUnMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'customSize' });
    };
}
