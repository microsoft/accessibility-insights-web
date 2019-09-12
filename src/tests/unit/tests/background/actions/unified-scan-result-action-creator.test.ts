// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload, UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { UnifiedScanResultActionCreator } from '../../../../../background/actions/unified-scan-result-action-creator';
import { UnifiedScanResultActions } from '../../../../../background/actions/unified-scan-result-actions';
import { Interpreter } from '../../../../../background/interpreter';
import { Action } from '../../../../../common/flux/action';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('UnifiedScanResultActionCreator', () => {
    it('should handle ScanCompleted message', () => {
        const payload: UnifiedScanCompletedPayload = {
            scanResult: [],
            rules: [],
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

    function createActionMock<Payload>(payload: Payload): IMock<Action<Payload>> {
        const actionMock = Mock.ofType<Action<Payload>>(Action);
        actionMock.setup(action => action.invoke(payload)).verifiable(Times.once());
        return actionMock;
    }

    function createActionsMock<ActionName extends keyof UnifiedScanResultActions>(
        actionName: ActionName,
        action: UnifiedScanResultActions[ActionName],
    ): IMock<UnifiedScanResultActions> {
        const actionsMock = Mock.ofType<UnifiedScanResultActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }

    function createInterpreterMock<Payload>(message: string, payload: Payload): IMock<Interpreter> {
        const interpreterMock = Mock.ofType<Interpreter>();
        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(message, It.is(isFunction)))
            .callback((_, handler) => handler(payload));
        return interpreterMock;
    }
});
