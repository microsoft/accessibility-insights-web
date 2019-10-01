// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

import { ConnectingPayload, ConnectionSucceedPayload } from './device-action-payloads';

export class DeviceActions {
    public readonly connectionSucceeded = new Action<ConnectionSucceedPayload>();
    public readonly connectionFailed = new Action<void>();
    public readonly connecting = new Action<ConnectingPayload>();
    public readonly defaulting = new Action<void>();
}
