// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { UnifiedScanResultActionCreator } from '../../../../../background/actions/unified-scan-result-action-creator';
import { UnifiedScanResultActions } from '../../../../../background/actions/unified-scan-result-actions';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';

describe('UnifiedScanResultActionCreator', () => {
    let scanResultActionsMock: IMock<UnifiedScanResultActions>;
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;

    let testSubject: UnifiedScanResultActionCreator;

    beforeEach(() => {
        scanResultActionsMock = Mock.ofType<UnifiedScanResultActions>();
        registerTypeToPayloadCallbackMock = Mock.ofType<RegisterTypeToPayloadCallback>();

        testSubject = new UnifiedScanResultActionCreator(scanResultActionsMock.object, registerTypeToPayloadCallbackMock.object);
    });

    it('registerCallbacks for ScanCompleted', () => {
        const payload: BaseActionPayload = {};

        const scanCompletedMock = createActionMock(payload);
        setupScanResultActionsMock('scanCompleted', scanCompletedMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.UnifiedScan.ScanCompleted, payload);

        testSubject.registerCallbacks();

        scanCompletedMock.verifyAll();
    });

    it('registerCallbacks for getCurrentState', () => {
        const payload: BaseActionPayload = null;

        const getCurrentStateMock = createActionMock(payload);
        setupScanResultActionsMock('getCurrentState', getCurrentStateMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.UnifiedScan.GetCurrentState, payload);

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    function createActionMock<T>(actionPayload: T): IMock<Action<T>> {
        const actionMock = Mock.ofType<Action<T>>(Action);
        actionMock.setup(action => action.invoke(actionPayload)).verifiable(Times.once());

        return actionMock;
    }

    function setupScanResultActionsMock(actionName: keyof UnifiedScanResultActions, actionMock: IMock<Action<any>>): void {
        scanResultActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any): void {
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(isFunction)))
            .callback((passedMessage, listener) => listener(payload));
    }
});
