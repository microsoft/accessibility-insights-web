// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SCAN_INCOMPLETE_WARNINGS } from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { StoreNames } from 'common/stores/store-names';
import { Interpreter } from '../interpreter';
import { UnifiedScanCompletedPayload } from './action-payloads';
import { UnifiedScanResultActions } from './unified-scan-result-actions';

export class UnifiedScanResultActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly unifiedScanResultActions: UnifiedScanResultActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly notificationCreator: NotificationCreator,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.UnifiedScan.ScanCompleted,
            this.onScanCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.UnifiedScanResultStore),
            this.onGetScanCurrentState,
        );
    }

    private onScanCompleted = (payload: UnifiedScanCompletedPayload): void => {
        this.unifiedScanResultActions.scanCompleted.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(SCAN_INCOMPLETE_WARNINGS, payload);
        this.notificationCreator.createNotification(payload.notificationText);
    };

    private onGetScanCurrentState = (): void => {
        this.unifiedScanResultActions.getCurrentState.invoke(null);
    };
}
