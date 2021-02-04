// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
    ) {}

    public setDeviceId(deviceId: string) {
        this.deviceId = deviceId;
    }

    public setPort(port: number) {
        this.port = port;
    }

    public EnableFocusTracking(): Promise<void> {
        return this.commandSender(this.port, DeviceFocusCommand.Enable);
    }

    public DisableFocusTracking(): Promise<void> {
        return this.commandSender(this.port, DeviceFocusCommand.Disable);
    }

    public ResetFocusTracking(): Promise<void> {
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

    public SendEnter(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Enter);
    }

    public SendTabKey(): Promise<void> {
        return this.SendKeyEvent(KeyEventCode.Tab);
    }

    private SendKeyEvent(keyEventCode: KeyEventCode): Promise<void> {
        return this.adbWrapper.sendKeyEvent(this.deviceId, keyEventCode);
    }
}
