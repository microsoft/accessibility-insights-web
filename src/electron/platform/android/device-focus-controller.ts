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
import { FocusActions } from 'electron/flux/action/focus-actions';
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
        private readonly focusActions: FocusActions,
        private readonly logger: Logger,
    ) {}

    public setDeviceId(deviceId: string) {
        this.deviceId = deviceId;
    }

    public setPort(port: number) {
        this.port = port;
    }

    public EnableFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {});
        this.wrapActionWithErrorHandling(this.commandSender(this.port, DeviceFocusCommand.Enable));
    };

    public DisableFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {});
        this.wrapActionWithErrorHandling(this.commandSender(this.port, DeviceFocusCommand.Disable));
    };

    public ResetFocusTracking = () => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {});
        this.wrapActionWithErrorHandling(this.commandSender(this.port, DeviceFocusCommand.Reset));
    };

    public SendUpKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Up));
    };

    public SendDownKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Down));
    };

    public SendLeftKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Left));
    };

    public SendRightKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Right));
    };

    public SendEnterKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Enter));
    };

    public SendTabKey = () => {
        this.wrapActionWithErrorHandling(this.SendKeyEvent(KeyEventCode.Tab));
    };

    private SendKeyEvent = (keyEventCode: KeyEventCode) => {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
        return this.adbWrapper.sendKeyEvent(this.deviceId, keyEventCode);
    };

    private wrapActionWithErrorHandling(innerAction: Promise<void>): void {
        innerAction.then().catch(this.commandFailed.bind(this));
    }

    private commandFailed(error: Error): void {
        this.logger.log('focus controller failure: ' + error);
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ERROR, {});
        this.focusActions.scanFailed.invoke(null);
    }
}
