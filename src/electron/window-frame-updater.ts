// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateStore } from './flux/store/window-state-store';
import { WindowStateStoreData } from './flux/types/window-state-store-data';

export class WindowFrameUpdater {
    constructor(private readonly windowStateStore: WindowStateStore, private readonly browserWindow: BrowserWindow) {}

    public async initialize(): Promise<void> {
        await this.onRouteChange(this.windowStateStore.getState());

        this.windowStateStore.addChangedListener(this.onRouteChange);
    }

    private onRouteChange = async (state: WindowStateStoreData) => {
        console.log('on route change');
        if (state.routeId === 'deviceConnectView') {
            this.browserWindow.setSize(600, 391);
        } else {
            this.browserWindow.maximize();
            console.log('Maximized');
        }
    };
}
