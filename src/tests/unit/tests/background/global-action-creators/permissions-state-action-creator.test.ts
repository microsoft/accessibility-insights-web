// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateActionCreator } from 'background/global-action-creators/permissions-state-action-creator';
import { Interpreter } from 'background/interpreter';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { IMock, It, Mock } from 'typemoq';

import { createActionMock, createInterpreterMock } from './action-creator-test-helpers';

describe('PermissionsStateActionCreator', () => {
    let permissionsStateActionsMock: IMock<PermissionsStateActions>;

    beforeEach(() => {
        permissionsStateActionsMock = Mock.ofType<PermissionsStateActions>();
    });

    it('handles getStoreState message', () => {
        const expectedMessage = getStoreStateMessage(StoreNames.PermissionsStateStore);
        const interpreterMock = createInterpreterMock(expectedMessage, null);
        const getCurrentStateMock = createActionMock(null);
        setupActionsMock('getCurrentState', getCurrentStateMock.object);
        const testSubject = new PermissionsStateActionCreator(interpreterMock.object, permissionsStateActionsMock.object);

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it.each([true, false])('handles SetPermissionsState message for payload %p', (payload: boolean) => {
        const expectedMessage = Messages.PermissionsState.SetPermissionsState;
        const interpreterMock = createInterpreterMock(expectedMessage, payload);
        const setPermissionsStateMock = createActionMock(payload);
        setupActionsMock('setPermissionsState', setPermissionsStateMock.object);
        const testSubject = new PermissionsStateActionCreator(interpreterMock.object, permissionsStateActionsMock.object);

        testSubject.registerCallbacks();

        setPermissionsStateMock.verifyAll();
    });

    const setupActionsMock = <ActionName extends keyof PermissionsStateActions>(
        actionName: ActionName,
        action: PermissionsStateActions[ActionName],
    ) => {
        permissionsStateActionsMock.setup(actions => actions[actionName]).returns(() => action);
    };
});
