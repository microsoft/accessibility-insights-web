// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';

// This class needs only to represent possible simultaneously invokable actions
// So, for example, the 'next' action may represent 'continue', 'try again', or 'start scanning'
export class AndroidSetupActions {
    public readonly cancel = new SyncAction<void>();
    public readonly next = new SyncAction<void>();
    public readonly readyToStart = new SyncAction<void>();
    public readonly rescan = new SyncAction<void>();
    public readonly saveAdbPath = new SyncAction<string>();
    public readonly setSelectedDevice = new SyncAction<DeviceInfo>();
}
