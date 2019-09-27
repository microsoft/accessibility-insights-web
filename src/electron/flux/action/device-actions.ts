// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ConnectingPayload, UpdateDevicePayload } from './device-action-payloads';

export class DeviceActions {
    public readonly updateDevice = new Action<UpdateDevicePayload>();
    public readonly connectionSucceed = new Action<void>();
    public readonly connectionFailed = new Action<void>();
    public readonly connecting = new Action<ConnectingPayload>();
}
