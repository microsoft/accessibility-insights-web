// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import { DEVICE_FOCUS_ERROR } from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';

export class TabStopsActionCreator {
    constructor(
        private readonly tabStopsActions: TabStopsActions,
        private readonly deviceConnectionActions: DeviceConnectionActions,
        private readonly deviceFocusController: DeviceFocusController,
        private readonly logger: Logger,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public enableTabStops = async () => {
        try {
            await this.deviceFocusController.enableFocusTracking();
            this.tabStopsActions.enableFocusTracking.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public disableTabStops = async () => {
        try {
            await this.deviceFocusController.disableFocusTracking();
            this.tabStopsActions.disableFocusTracking.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public startOver = async () => {
        try {
            await this.deviceFocusController.resetFocusTracking();
            this.tabStopsActions.startOver.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public sendUpKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Up),
        );
    };

    public sendDownKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Down),
        );
    };

    public sendLeftKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Left),
        );
    };

    public sendRightKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Right),
        );
    };

    public sendTabKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Tab),
        );
    };

    public sendEnterKey = async () => {
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Enter),
        );
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
        this.deviceConnectionActions.statusConnected.invoke();
    }

    private commandFailed(error: Error): void {
        this.logger.log('focus controller failure: ' + error);
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ERROR, {});
        this.deviceConnectionActions.statusDisconnected.invoke();
    }
}
