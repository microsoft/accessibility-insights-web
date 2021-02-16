// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
import { AdbWrapper, KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';

export class DeviceFocusController {
    private deviceId: string;
    private port: number;

    constructor(
        private readonly adbWrapper: AdbWrapper,
        private readonly commandSender: DeviceFocusCommandSender,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public setDeviceId(deviceId: string) {
        this.deviceId = deviceId;
    }

    public setPort(port: number) {
        this.port = port;
    }

    public enableFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {});
        return this.commandSender(this.port, DeviceFocusCommand.Enable);
    };

    public disableFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {});
        return this.commandSender(this.port, DeviceFocusCommand.Disable);
    };

    public resetFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {});
        return this.commandSender(this.port, DeviceFocusCommand.Reset);
    };

    public sendUpKey = () => {
        return this.sendKeyEvent(KeyEventCode.Up);
    };

    public sendDownKey = () => {
        return this.sendKeyEvent(KeyEventCode.Down);
    };

    public sendLeftKey = () => {
        return this.sendKeyEvent(KeyEventCode.Left);
    };

    public sendRightKey = () => {
        return this.sendKeyEvent(KeyEventCode.Right);
    };

    public sendEnterKey = () => {
        return this.sendKeyEvent(KeyEventCode.Enter);
    };

    public sendTabKey = () => {
        return this.sendKeyEvent(KeyEventCode.Tab);
    };

    private sendKeyEvent = (keyEventCode: KeyEventCode) => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
        return this.adbWrapper.sendKeyEvent(this.deviceId, keyEventCode);
    };
}
