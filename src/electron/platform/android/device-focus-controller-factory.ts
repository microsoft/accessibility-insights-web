// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';

export class DeviceFocusControllerFactory {
    constructor(
        private readonly adbWrapperFactory: AdbWrapperFactory,
        private readonly focusCommandSender: DeviceFocusCommandSender,
    ) {}

    public initialize(): void {
        // Temporary placeholder to let me call this class
    }

    public getDeviceFocusController = async (
        adbLocation: string,
    ): Promise<DeviceFocusController> => {
        const adbWrapper: AdbWrapper = await this.adbWrapperFactory.createValidatedAdbWrapper(
            adbLocation,
        );
        return new DeviceFocusController(adbWrapper, this.focusCommandSender);
    };
}
