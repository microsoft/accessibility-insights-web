// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';

import { DeviceConnectState } from '../../views/device-connect-view/components/device-connect-state';
import { ConnectingPayload, ConnectionSucceedPayload } from '../action/device-action-payloads';
import { DeviceActions } from '../action/device-actions';
import { DeviceStoreData } from '../types/device-store-data';

export class DeviceStore extends BaseStoreImpl<DeviceStoreData> {
    constructor(private readonly deviceActions: DeviceActions) {
        super(StoreNames.DeviceStore);
    }

    public getDefaultState(): DeviceStoreData {
        return {
            deviceConnectState: DeviceConnectState.Default,
            connectedDevice: null,
            port: null,
        };
    }

    protected addActionListeners(): void {
        this.deviceActions.connectionFailed.addListener(this.onConnectionFailed);
        this.deviceActions.connectionSucceeded.addListener(this.onConnectionSucceeded);
        this.deviceActions.connecting.addListener(this.onConnecting);
        this.deviceActions.resetConnection.addListener(this.onResetConnection);
    }

    private onResetConnection = () => {
        if (this.state.deviceConnectState === DeviceConnectState.Default) {
            return;
        }

        this.state.deviceConnectState = DeviceConnectState.Default;

        this.emitChanged();
    };

    private onConnecting = (payload: ConnectingPayload) => {
        if (this.state.deviceConnectState === DeviceConnectState.Connecting && this.state.port === payload.port) {
            return;
        }

        this.state.deviceConnectState = DeviceConnectState.Connecting;
        this.state.port = payload.port;

        this.emitChanged();
    };

    private onConnectionSucceeded = (payload: ConnectionSucceedPayload) => {
        if (this.state.deviceConnectState === DeviceConnectState.Connected) {
            return;
        }

        this.state.deviceConnectState = DeviceConnectState.Connected;
        this.state.connectedDevice = payload.connectedDevice;

        this.emitChanged();
    };

    private onConnectionFailed = () => {
        if (this.state.deviceConnectState === DeviceConnectState.Error) {
            return;
        }

        this.state.deviceConnectState = DeviceConnectState.Error;

        this.emitChanged();
    };
}
