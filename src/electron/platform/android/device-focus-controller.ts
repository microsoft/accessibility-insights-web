// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_ERROR,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import {
    DeviceFocusCommand,
    DeviceFocusCommandSender,
} from 'electron/platform/android/device-focus-command-sender';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';

export class DeviceFocusController {
    private deviceId: string;
    private port: number;

    constructor(
        private readonly adbWrapperHolder: AdbWrapperHolder,
        private readonly commandSender: DeviceFocusCommandSender,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly deviceConnectionActions: DeviceConnectionActions,
        private readonly logger: Logger,
        private readonly androidSetupStore: AndroidSetupStore,
    ) {}

    public initialize(): void {
        this.androidSetupStore.addChangedListener(this.setDeviceData);
    }

    private setDeviceData = (store: AndroidSetupStore) => {
        const data = store.getState();
        this.port = data.scanPort;
        this.deviceId = data.selectedDevice?.id;
    };

    public enableFocusTracking = async () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {});
        await this.wrapActionWithErrorHandling(
            this.commandSender(this.port, DeviceFocusCommand.Enable),
        );
    };

    public disableFocusTracking = async () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {});
        await this.wrapActionWithErrorHandling(
            this.commandSender(this.port, DeviceFocusCommand.Disable),
        );
    };

    public resetFocusTracking = async () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {});
        await this.wrapActionWithErrorHandling(
            this.commandSender(this.port, DeviceFocusCommand.Reset),
        );
    };

    public sendUpKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Up));
    };

    public sendDownKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Down));
    };

    public sendLeftKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Left));
    };

    public sendRightKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Right));
    };

    public sendEnterKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Enter));
    };

    public sendTabKey = async () => {
        await this.wrapActionWithErrorHandling(this.sendKeyEvent(KeyEventCode.Tab));
    };

    private sendKeyEvent = (keyEventCode: KeyEventCode): Promise<void> => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
        return this.adbWrapperHolder.getAdb().sendKeyEvent(this.deviceId, keyEventCode);
    };

    private wrapActionWithErrorHandling = async (innerAction: Promise<void>) => {
        try {
            await innerAction;
            this.commandSucceeded();
        } catch (error) {
            this.commandFailed(error);
        }
    };

    private commandSucceeded(): void {
        this.deviceConnectionActions.statusConnected.invoke(null);
    }

    private commandFailed(error: Error): void {
        this.logger.log('focus controller failure: ' + error);
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ERROR, {});
        this.deviceConnectionActions.statusDisconnected.invoke(null);
    }
}
