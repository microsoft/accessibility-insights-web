// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

import { ConnectedDevicePayload, PortPayload } from './device-action-payloads';

export class DeviceActions {
    public readonly connectionSucceeded = new Action<ConnectedDevicePayload>();
    public readonly connectionFailed = new Action<void>();
    public readonly connecting = new Action<PortPayload>();
    public readonly resetConnection = new Action<void>();
}
