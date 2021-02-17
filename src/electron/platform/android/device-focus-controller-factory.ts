// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusCommandSender } from 'electron/platform/android/device-focus-command-sender';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';

export class DeviceFocusControllerFactory {
    constructor(
        private readonly focusCommandSender: DeviceFocusCommandSender,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly deviceConnectionActions: DeviceConnectionActions,
        private readonly logger: Logger,
    ) {}

    public getDeviceFocusController = (adbWrapper: AdbWrapper): DeviceFocusController => {
        return new DeviceFocusController(
            adbWrapper,
            this.focusCommandSender,
            this.telemetryEventHandler,
            this.deviceConnectionActions,
            this.logger,
        );
    };
}
