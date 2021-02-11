// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';

export class DeviceFocusControllerFactory {
    constructor(private readonly focusCommandSender: DeviceFocusCommandSender) {}

    public getDeviceFocusController = (adbWrapper: AdbWrapper): DeviceFocusController => {
        return new DeviceFocusController(adbWrapper, this.focusCommandSender);
    };
}
