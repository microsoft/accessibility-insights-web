// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';
import { WindowStateStoreData } from '../types/window-state-store-data';

export class WindowStateStore extends BaseStoreImpl<WindowStateStoreData> {
    constructor(private readonly windowStateActions: WindowStateActions) {
        super(StoreNames.WindowStateStore);
    }

    public getDefaultState(): WindowStateStoreData {
        return {
            routeId: 'deviceConnectView',
        };
    }

    protected addActionListeners(): void {
        this.windowStateActions.changeDeviceRoute.addListener(this.onChangeDeviceRoute);
    }

    private onChangeDeviceRoute = (payload: RoutePayload) => {
        if (this.state.routeId === payload.routeId) {
            return;
        }
        this.state.routeId = payload.routeId;
        this.emitChanged();
    };
}
