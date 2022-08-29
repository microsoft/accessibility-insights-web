// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';

export class DeviceConnectionActions {
    public readonly statusUnknown = new SyncAction<void>();
    public readonly statusConnected = new SyncAction<void>();
    public readonly statusDisconnected = new SyncAction<void>();
}
