// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { ScopingActions, ScopingPayload } from 'background/actions/scoping-actions';
import { ScopingActionCreator } from 'background/global-action-creators/scoping-action-creator';
import { Interpreter } from 'background/interpreter';
import { Action } from '../../../../../common/flux/action';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('ScopingActionCreator', () => {
    let interpreterMock: IMock<Interpreter>;
    let scopingActionsMock: IMock<ScopingActions>;

    let testSubject: ScopingActionCreator;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        scopingActionsMock = Mock.ofType<ScopingActions>();

        testSubject = new ScopingActionCreator(interpreterMock.object, scopingActionsMock.object);
    });

    it('handles GetCurrentState', () => {
        const expectedMessage = getStoreStateMessage(StoreNames.ScopingPanelStateStore);

        setupInterpreterMock(expectedMessage);

        const getCurrentStateMock = createActionMock();

        setupActionsMock('getCurrentState', getCurrentStateMock.object);

        testSubject.registerCallback();

        getCurrentStateMock.verifyAll();
    });

    it('handles AddSelector', () => {
        const expectedMessage = Messages.Scoping.AddSelector;

        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['html'],
        };

        setupInterpreterMock(expectedMessage, payload);

        const addSelectorMock = createActionMock(payload);

        setupActionsMock('addSelector', addSelectorMock.object);

        testSubject.registerCallback();

        addSelectorMock.verifyAll();
    });

    it('handles DeleteSelector', () => {
        const expectedMessage = Messages.Scoping.DeleteSelector;

        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['html'],
        };

        setupInterpreterMock(expectedMessage, payload);

        const deleteSelectorMock = createActionMock(payload);

        setupActionsMock('deleteSelector', deleteSelectorMock.object);

        testSubject.registerCallback();

        deleteSelectorMock.verifyAll();
    });

    const setupInterpreterMock = <Payload>(expectedMessage: string, payload?: Payload): void => {
        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => {
                if (payload) {
                    handler(payload);
                } else {
                    handler();
                }
            });
    };

    const createActionMock = <Payload = void>(payload: Payload = null): IMock<Action<Payload>> => {
        const actionMock = Mock.ofType<Action<Payload>>();

        actionMock.setup(action => action.invoke(payload)).verifiable(Times.once());

        return actionMock;
    };

    const setupActionsMock = <ActionName extends keyof ScopingActions>(actionName: ActionName, action: ScopingActions[ActionName]) => {
        scopingActionsMock.setup(actions => actions[actionName]).returns(() => action);
    };
});
