// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateActionCreator } from './flux/action-creator/window-state-action-creator';

export class WindowFrameListener {
    constructor(private readonly windowStateActionsCreator: WindowStateActionCreator, private readonly browserWindow: BrowserWindow) {}

    public initialize(): void {
        this.browserWindow.on('minimize', this.onWindowStateChange);
        this.browserWindow.on('maximize', this.onWindowStateChange);
        this.browserWindow.on('unmaximize', this.onWindowStateChange);
    }

    private onWindowStateChange = (): void => {
        if (this.browserWindow.isMinimized()) {
            this.windowStateActionsCreator.setWindowState({ currentWindowState: 'minimized' });
        } else if (this.browserWindow.isMaximized()) {
            this.windowStateActionsCreator.setWindowState({ currentWindowState: 'maximized' });
        } else {
            this.windowStateActionsCreator.setWindowState({ currentWindowState: 'customSize' });
        }
    };
}
