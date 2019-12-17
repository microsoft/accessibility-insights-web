// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateActionCreator } from 'background/global-action-creators/permissions-state-action-creator';
import { Interpreter } from 'background/interpreter';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { isFunction } from 'lodash';
import { IMock, It, Mock } from 'typemoq';

import { createActionMock } from './action-creator-test-helpers';

describe('PermissionsStateActionCreator', () => {
    let interpreterMock: IMock<Interpreter>;
    let permissionsStateActionsMock: IMock<PermissionsStateActions>;

    let testSubject: PermissionsStateActionCreator;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        permissionsStateActionsMock = Mock.ofType<PermissionsStateActions>();

        testSubject = new PermissionsStateActionCreator(interpreterMock.object, permissionsStateActionsMock.object);
    });

    it('handles getStoreState message', () => {
        const expectedMessage = getStoreStateMessage(StoreNames.PermissionsStateStore);
        setupInterpreterMock(expectedMessage);
        const getCurrentStateMock = createActionMock(null);
        setupActionsMock('getCurrentState', getCurrentStateMock.object);

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it.each([true, false])('handles SetPermissionsState message for payload %p', (payload: boolean) => {
        const expectedMessage = Messages.PermissionsState.SetPermissionsState;
        setupInterpreterMock(expectedMessage, payload);
        const setPermissionsStateMock = createActionMock(payload);
        setupActionsMock('setPermissionsState', setPermissionsStateMock.object);

        testSubject.registerCallbacks();

        setPermissionsStateMock.verifyAll();
    });

    const setupInterpreterMock = <Payload>(expectedMessage: string, payload?: Payload): void => {
        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => handler(payload));
    };

    const setupActionsMock = <ActionName extends keyof PermissionsStateActions>(
        actionName: ActionName,
        action: PermissionsStateActions[ActionName],
    ) => {
        permissionsStateActionsMock.setup(actions => actions[actionName]).returns(() => action);
    };
});
