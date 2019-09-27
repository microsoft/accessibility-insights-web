// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState } from '../../device-connect-view/components/device-connect-body';

export interface DeviceStoreData {
    deviceConnectState: DeviceConnectState;
    connectedDevice: string;
}
