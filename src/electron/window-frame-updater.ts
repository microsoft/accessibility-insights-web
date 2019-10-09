// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateStore } from './flux/store/window-state-store';

export class WindowFrameUpdater {
    constructor(private readonly windowStateStore: WindowStateStore, private readonly browserWindow: BrowserWindow) {}

    public initialize(): void {
        this.onWindowStateChange();
        this.windowStateStore.addChangedListener(this.onWindowStateChange);
    }

    private onWindowStateChange = () => {
        if (this.windowStateStore.getState().routeId === 'deviceConnectView') {
            this.browserWindow.setSize(600, 391);
            this.browserWindow.center();
        } else {
            switch (this.windowStateStore.getState().currentWindowState) {
                case 'restoredOrMaximized':
                    if (this.browserWindow.isMaximized()) {
                        this.browserWindow.restore();
                    } else {
                        this.browserWindow.maximize();
                    }
                    break;
                case 'minimized':
                    if (!this.browserWindow.isMinimized()) {
                        this.browserWindow.minimize();
                    }
                    break;
                default:
                    break;
            }
        }
    };
}
