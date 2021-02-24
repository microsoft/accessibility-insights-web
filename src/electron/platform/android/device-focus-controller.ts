// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';

export class DeviceFocusController {
    constructor(
        private readonly adbWrapperHolder: AdbWrapperHolder,
        private readonly commandSender: DeviceFocusCommandSender,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly androidSetupStore: AndroidSetupStore,
    ) {}

    public enableFocusTracking = async () => {
        const scanPort = this.getScanPort();
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {});
        await this.commandSender(scanPort, DeviceFocusCommand.Enable);
    };

    public disableFocusTracking = async () => {
        const scanPort = this.getScanPort();
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {});
        await this.commandSender(scanPort, DeviceFocusCommand.Disable);
    };

    public resetFocusTracking = async () => {
        const scanPort = this.getScanPort();
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {});
        await this.commandSender(scanPort, DeviceFocusCommand.Reset);
    };

    public sendKeyEvent = async (keyEventCode: KeyEventCode) => {
        const selectedDevice = this.getSelectedDevice();
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
        return this.adbWrapperHolder.getAdb().sendKeyEvent(selectedDevice.id, keyEventCode);
    };

    private getScanPort = () => {
        const scanPort = this.androidSetupStore.getState().scanPort;
        if (scanPort == null) {
            throw new Error('scan port not found');
        }
        return scanPort;
    };

    private getSelectedDevice = () => {
        const selectedDevice = this.androidSetupStore.getState().selectedDevice;
        if (selectedDevice == null) {
            throw new Error('selected device not found');
        }
        return selectedDevice;
    };
}
