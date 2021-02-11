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

    public EnableFocusTracking(): Promise<void> {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {});
        return this.commandSender(this.port, DeviceFocusCommand.Enable);
    }

    public DisableFocusTracking(): Promise<void> {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {});
        return this.commandSender(this.port, DeviceFocusCommand.Disable);
    }

    public ResetFocusTracking(): Promise<void> {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {});
        return this.commandSender(this.port, DeviceFocusCommand.Reset);
    }

    public SendUpKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Up);
    }

    public SendDownKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Down);
    }

    public SendLeftKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Left);
    }

    public SendRightKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Right);
    }

    public SendEnterKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Enter);
    }

    public SendTabKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Tab);
    }

    private SendKeyEvent(keyEventCode: KeyEventCode): Promise<void> {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
        return this.adbWrapper.sendKeyEvent(this.deviceId, keyEventCode);
    }
}
