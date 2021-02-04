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

    public SendResumeTrackingCommandToDevice(): Promise<void> {
        return this.commandSender(this.port, DeviceFocusCommand.Resume);
    }

    public SendPauseTrackingCommandToDevice(): Promise<void> {
        return this.commandSender(this.port, DeviceFocusCommand.Pause);
    }

    public SendEndTrackingCommandToDevice(): Promise<void> {
        return this.commandSender(this.port, DeviceFocusCommand.End);
    }

    public SendUpKeyToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Up);
    }

    public SendDownKeyToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Down);
    }

    public SendLeftKeyToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Left);
    }

    public SendRightKeyToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Right);
    }

    public SendEnterToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Enter);
    }

    public SendTabKeyToDevice(): Promise<void> {
        return this.SendKeyEventToDevice(KeyEventCode.Tab);
    }

    private SendKeyEventToDevice(keyEventCode: KeyEventCode): Promise<void> {
        return this.adbWrapper.sendKeyEvent(this.deviceId, keyEventCode);
    }
}
