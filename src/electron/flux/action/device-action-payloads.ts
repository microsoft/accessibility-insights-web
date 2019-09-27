// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState } from '../../device-connect-view/components/device-connect-state';

export interface UpdateDevicePayload {
    deviceConnectState: DeviceConnectState;
    connectedDevice?: string;
}

export interface ConnectingPayload {
    port: number;
}

export interface ConnectionSucceedPayload {
    connectedDevice: string;
}
