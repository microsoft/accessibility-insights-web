// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { DeviceConnectionStatus } from 'electron/flux/types/device-connection-status';
import { DeviceConnectionStoreData } from 'electron/flux/types/device-connection-store-data';

export class DeviceConnectionStore extends BaseStoreImpl<DeviceConnectionStoreData> {
    constructor(private readonly deviceConnectionActions: DeviceConnectionActions) {
        super(StoreNames.DeviceConnectionStore);
    }

    public getDefaultState(): DeviceConnectionStoreData {
        return {
            status: DeviceConnectionStatus.Unknown,
        };
    }

    protected addActionListeners(): void {
        this.deviceConnectionActions.statusUnknown.addListener(this.onStatusUnknown);
        this.deviceConnectionActions.statusConnected.addListener(this.onStatusConnected);
        this.deviceConnectionActions.statusDisconnected.addListener(this.onStatusDisconnected);
    }

    private onStatusUnknown = () => this.updateStatus(DeviceConnectionStatus.Unknown);

    private onStatusConnected = () => this.updateStatus(DeviceConnectionStatus.Connected);

    private onStatusDisconnected = () => this.updateStatus(DeviceConnectionStatus.Disconnected);

    private updateStatus(newStatus: DeviceConnectionStatus): void {
        if (this.state.status === newStatus) {
            return;
        }

        this.state.status = newStatus;

        this.emitChanged();
    }
}
