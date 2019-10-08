// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateStore } from './flux/store/window-state-store';

export class WindowFrameUpdater {
    constructor(private readonly windowStateStore: WindowStateStore, private readonly browserWindow: BrowserWindow) {}

    public initialize(): void {
        this.windowStateStore.addChangedListener(this.onWindowStateChange);
        this.windowStateStore.addChangedListener(this.onRouteChange);
    }

    private onRouteChange = (store: WindowStateStore) => {
        if (store.getState().routeId === 'deviceConnectView') {
            if (this.browserWindow.isMaximized()) {
                return;
            }
            this.browserWindow.setSize(600, 391);
        } else {
            this.browserWindow.maximize();
        }
    };

    private onWindowStateChange = (store: WindowStateStore) => {
        switch (store.getState().currentWindowState) {
            case 'restoredOrMaximized':
                if (this.browserWindow.isMaximized()) {
                    this.browserWindow.unmaximize();
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
    };
}
