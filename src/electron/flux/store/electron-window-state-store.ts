// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { WindowStateActions } from '../action/window-state-actions';
import { ElectronWindowStateStoreData } from '../types/electron-window-state-store-data';

export class ElectronWindowStateStore extends BaseStoreImpl<ElectronWindowStateStoreData> {
    constructor(private readonly windowStateActions: WindowStateActions) {
        super(StoreNames.ElectronWindowStateStore);
    }

    public getDefaultState(): ElectronWindowStateStoreData {
        return this.getDeviceConnectWindowState();
    }

    protected addActionListeners(): void {
        this.windowStateActions.setDeviceConnectRoute.addListener(this.onSetDeviceConnectRoute);
        this.windowStateActions.setResultsViewRoute.addListener(this.onSetResultsViewRoute);
    }

    private getDeviceConnectWindowState(): ElectronWindowStateStoreData {
        return {
            routeId: 'deviceConnectView',
        };
    }

    private getResultViewWindowState(): ElectronWindowStateStoreData {
        return {
            routeId: 'resultsView',
        };
    }

    private onSetDeviceConnectRoute = () => {
        this.state = this.getDeviceConnectWindowState();
        this.emitChanged();
    };

    private onSetResultsViewRoute = () => {
        this.state = this.getResultViewWindowState();
        this.emitChanged();
    };
}
