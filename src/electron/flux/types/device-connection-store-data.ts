// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceConnectionStatus } from 'electron/flux/types/device-connection-status';

export interface DeviceConnectionStoreData {
    status: DeviceConnectionStatus;
}
