// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { SupportedMouseEvent, TelemetryDataFactory } from 'common/telemetry-data-factory';
import {
    DEVICE_FOCUS_DISABLE,
    DEVICE_FOCUS_ENABLE,
    DEVICE_FOCUS_ERROR,
    DEVICE_FOCUS_KEYEVENT,
    DEVICE_FOCUS_RESET,
} from 'electron/common/electron-telemetry-events';
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
        private readonly telemetryDataFactory: TelemetryDataFactory,
    ) {}

    public enableTabStops = async (event: SupportedMouseEvent) => {
        try {
            const telemetry = this.telemetryDataFactory.withTriggeredByAndSource(
                event,
                TelemetryEventSource.ElectronResultsView,
            );
            this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ENABLE, {
                telemetry,
            });
            await this.deviceFocusController.enableFocusTracking();
            this.tabStopsActions.enableFocusTracking.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public disableTabStops = async (event: SupportedMouseEvent) => {
        try {
            const telemetry = this.telemetryDataFactory.withTriggeredByAndSource(
                event,
                TelemetryEventSource.ElectronResultsView,
            );
            this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_DISABLE, {
                telemetry,
            });
            await this.deviceFocusController.disableFocusTracking();
            this.tabStopsActions.disableFocusTracking.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public startOver = async (event: SupportedMouseEvent) => {
        try {
            const telemetry = this.telemetryDataFactory.withTriggeredByAndSource(
                event,
                TelemetryEventSource.ElectronResultsView,
            );
            this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_RESET, {
                telemetry,
            });
            await this.deviceFocusController.resetFocusTracking();
            this.tabStopsActions.startOver.invoke();
            this.deviceConnectionActions.statusConnected.invoke();
        } catch (e) {
            this.commandFailed(e);
        }
    };

    public resetTabStopsToDefaultState = async () => {
        try {
            this.tabStopsActions.startOver.invoke();
            await this.deviceFocusController.resetFocusTracking();
        } catch (e) {
            this.logger.log('reset tab stops to default state silently failed: ' + e);
        }
    };

    public sendUpKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Up);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Up),
        );
    };

    public sendDownKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Down);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Down),
        );
    };

    public sendLeftKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Left);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Left),
        );
    };

    public sendRightKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Right);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Right),
        );
    };

    public sendTabKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Tab);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Tab),
        );
    };

    public sendEnterKey = async () => {
        this.publishTelemetryForKeyboardEvent(KeyEventCode.Enter);
        await this.wrapActionWithErrorHandling(
            this.deviceFocusController.sendKeyEvent(KeyEventCode.Enter),
        );
    };

    private publishTelemetryForKeyboardEvent(keyEventCode: KeyEventCode): void {
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_KEYEVENT, {
            telemetry: {
                keyEventCode,
            },
        });
    }

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
        this.telemetryEventHandler.publishTelemetry(DEVICE_FOCUS_ERROR, {
            telemetry: {
                source: TelemetryEventSource.ElectronResultsView,
                triggeredBy: TriggeredByNotApplicable,
            },
        });
        this.deviceConnectionActions.statusDisconnected.invoke();
    }
}
