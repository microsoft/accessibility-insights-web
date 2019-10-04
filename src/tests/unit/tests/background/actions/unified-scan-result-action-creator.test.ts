// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { UnifiedScanResultActionCreator } from 'background/actions/unified-scan-result-action-creator';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { IMock, Mock } from 'typemoq';

import { ToolData } from '../../../../../common/types/store-data/unified-data-interface';
import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';

describe('UnifiedScanResultActionCreator', () => {
    it('should handle ScanCompleted message', () => {
        const payload: UnifiedScanCompletedPayload = {
            scanResult: [],
            rules: [],
            toolInfo: {} as ToolData,
            targetAppInfo: { name: 'app name' },
        };

        const scanCompletedMock = createActionMock(payload);
        const actionsMock = createActionsMock('scanCompleted', scanCompletedMock.object);
        const interpreterMock = createInterpreterMock(Messages.UnifiedScan.ScanCompleted, payload);

        const testSubject = new UnifiedScanResultActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallbacks();

        scanCompletedMock.verifyAll();
    });

    it('should handle GetState message', () => {
        const payload = null;

        const getCurrentStateMock = createActionMock<null>(payload);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(getStoreStateMessage(StoreNames.UnifiedScanResultStore), payload);

        const testSubject = new UnifiedScanResultActionCreator(interpreterMock.object, actionsMock.object);

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
