// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';

import { DeviceConnectState } from '../../device-connect-view/components/device-connect-body';
import { DeviceActions } from '../action/device-actions';
import { UpdateDevicePayload } from '../action/update-device-payload';
import { DeviceStoreData } from '../types/device-store-data';

export class DeviceStore extends BaseStoreImpl<DeviceStoreData> {
    constructor(private readonly deviceActions: DeviceActions) {
        super(StoreNames.DeviceStore);
    }

    public getDefaultState(): DeviceStoreData {
        return {
            deviceConnectState: DeviceConnectState.Default,
            connectedDevice: null,
        };
    }

    protected addActionListeners(): void {
        this.deviceActions.updateDevice.addListener(this.onUpdateDevice);
    }

    private onUpdateDevice = (payload: UpdateDevicePayload) => {
        let updated = false;

        if (payload.deviceConnectState !== this.state.deviceConnectState) {
            this.state.deviceConnectState = payload.deviceConnectState;
            updated = true;
        }

        if (payload.connectedDevice && payload.connectedDevice !== this.state.connectedDevice) {
            this.state.connectedDevice = payload.connectedDevice;
            updated = true;
        }

        if (updated) {
            this.emitChanged();
        }
    };
}
