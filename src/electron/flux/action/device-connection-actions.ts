// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class DeviceConnectionActions {
    public readonly statusUnknown = new Action<void>();
    public readonly statusConnected = new Action<void>();
    public readonly statusDisconnected = new Action<void>();
}
