// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState } from './device-connect-state';

export interface DeviceStoreData {
    deviceConnectState: DeviceConnectState;
    connectedDevice: string;
    port: number;
}
