// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
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
        testRegistrationOfCallback(Messages.UnifiedScan.ScanCompleted, 'scanCompleted', {
            scanResult: null,
        });
    });

    it('registerCallbacks for getCurrentState', () => {
        testRegistrationOfCallback(Messages.UnifiedScan.GetCurrentState, 'getCurrentState', null);
    });

    function testRegistrationOfCallback(
        message: string,
        actionName: keyof UnifiedScanResultActions,
        payload: UnifiedScanCompletedPayload,
    ): void {
        const actionMock = Mock.ofType<Action<UnifiedScanCompletedPayload>>(Action);
        actionMock.setup(action => action.invoke(payload)).verifiable(Times.once());
        scanResultActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(isFunction)))
            .callback((passedMessage, listener) => listener(payload));
        testSubject.registerCallbacks();

        actionMock.verifyAll();
    }
});
