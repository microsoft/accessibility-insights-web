// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { UpdateDevicePayload } from './device-action-payloads';

export class DeviceActions {
    public readonly updateDevice = new Action<UpdateDevicePayload>();
}
