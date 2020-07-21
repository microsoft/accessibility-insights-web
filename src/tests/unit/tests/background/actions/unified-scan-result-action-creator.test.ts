// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { UnifiedScanResultActionCreator } from 'background/actions/unified-scan-result-action-creator';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    SCAN_INCOMPLETE_WARNINGS,
    ScanIncompleteWarningsTelemetryData,
} from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { StoreNames } from 'common/stores/store-names';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IMock, Mock, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('UnifiedScanResultActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let notificationCreatorMock: IMock<NotificationCreator>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        notificationCreatorMock = Mock.ofType<NotificationCreator>();
    });

    it('should handle ScanCompleted message', () => {
        const scanIncompleteWarnings = ['test-warning-id' as ScanIncompleteWarningId];
        const telemetry = {
            scanIncompleteWarnings,
        } as ScanIncompleteWarningsTelemetryData;
        const payload: UnifiedScanCompletedPayload = {
            scanResult: [],
            rules: [],
            toolInfo: {} as ToolData,
            targetAppInfo: { name: 'app name' },
            timestamp: 'timestamp',
            scanIncompleteWarnings,
            telemetry,
        };

        const scanCompletedMock = createActionMock(payload);
        const actionsMock = createActionsMock('scanCompleted', scanCompletedMock.object);
        const interpreterMock = createInterpreterMock(Messages.UnifiedScan.ScanCompleted, payload);

        const testSubject = new UnifiedScanResultActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            notificationCreatorMock.object,
        );

        testSubject.registerCallbacks();

        scanCompletedMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(SCAN_INCOMPLETE_WARNINGS, payload),
            Times.once(),
        );
        notificationCreatorMock.verify(
            handler => handler.createNotification(payload.notificationText),
            Times.once(),
        );
    });

    it('should handle GetState message', () => {
        const payload = null;

        const getCurrentStateMock = createActionMock<null>(payload);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.UnifiedScanResultStore),
            payload,
        );

        const testSubject = new UnifiedScanResultActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            notificationCreatorMock.object,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof UnifiedScanResultActions>(
        actionName: ActionName,
        action: UnifiedScanResultActions[ActionName],
    ): IMock<UnifiedScanResultActions> {
        const actionsMock = Mock.ofType<UnifiedScanResultActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
