// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { ElectronWindowStateStoreData } from '../types/electron-window-state-store-data';

export class ElectronWindowStateStore extends BaseStoreImpl<ElectronWindowStateStoreData> {
    constructor() {
        super(StoreNames.ElectronWindowStateStore);
    }

    public getDefaultState(): ElectronWindowStateStoreData {
        return this.getDeviceConnectWindowState();
    }

    protected addActionListeners(): void {}

    private getDeviceConnectWindowState(): ElectronWindowStateStoreData {
        return {
            routeId: 'deviceConnectView',
            windowWidth: 600,
            windowHeight: 391,
        };
    }
}
