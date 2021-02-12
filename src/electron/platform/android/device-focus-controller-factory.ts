// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { AdbWrapper, AdbWrapperFactory } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';

export class DeviceFocusControllerFactory {
    constructor(
        private readonly adbWrapperFactory: AdbWrapperFactory,
        private readonly focusCommandSender: DeviceFocusCommandSender,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public initialize(): void {
        // Temporary placeholder to let me call this class from renderer-initializer
    }

    public getDeviceFocusController = async (
        adbLocation: string,
    ): Promise<DeviceFocusController> => {
        const adbWrapper: AdbWrapper = await this.adbWrapperFactory.createValidatedAdbWrapper(
            adbLocation,
        );
        return new DeviceFocusController(
            adbWrapper,
            this.focusCommandSender,
            this.telemetryEventHandler,
        );
    };
}
