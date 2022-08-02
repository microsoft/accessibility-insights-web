// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { WindowStatePayload } from 'electron/flux/action/window-state-payload';

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
            currentWindowState: 'customSize',
        };
    }

    protected addActionListeners(): void {
        this.windowStateActions.setRoute.addListener(this.onSetRoute);
        this.windowStateActions.setWindowState.addListener(this.onSetWindowState);
    }

    private onSetRoute: (payload: RoutePayload) => Promise<void> = async (
        payload: RoutePayload,
    ) => {
        if (this.state.routeId === payload.routeId) {
            return;
        }
        this.state.routeId = payload.routeId;
        this.emitChanged();
    };

    private onSetWindowState: (payload: WindowStatePayload) => Promise<void> = async (
        payload: WindowStatePayload,
    ) => {
        if (payload.currentWindowState === this.state.currentWindowState) {
            return;
        }

        this.state.currentWindowState = payload.currentWindowState;
        this.emitChanged();
    };
}
