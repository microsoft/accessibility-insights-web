// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';

// This class needs only to represent possible simultaneously invokable actions
// So, for example, the 'next' action may represent 'continue', 'try again', or 'start scanning'
export class AndroidSetupActions {
    public readonly cancel = new Action<void>();
    public readonly next = new Action<void>();
    public readonly readyToStart = new Action<void>();
    public readonly rescan = new Action<void>();
    public readonly saveAdbPath = new Action<string>();
    public readonly setSelectedDevice = new Action<DeviceInfo>();
}
