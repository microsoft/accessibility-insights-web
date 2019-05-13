// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { ScopingActions, ScopingPayload } from '../../../../../background/actions/scoping-actions';
import { ScopingActionCreator } from '../../../../../background/global-action-creators/scoping-action-creator';
import { Interpreter } from '../../../../../background/interpreter';
import { Action } from '../../../../../common/flux/action';
import { Messages } from '../../../../../common/messages';

describe('ScopingActionCreator', () => {
    let interpreterMock: IMock<Interpreter>;
    let scopingActionsMock: IMock<ScopingActions>;

    let testSubject: ScopingActionCreator;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        scopingActionsMock = Mock.ofType<ScopingActions>();

        testSubject = new ScopingActionCreator(interpreterMock.object, scopingActionsMock.object);
    });

    it('handles GetcurrentState', () => {
        const expectedMessage = Messages.Scoping.GetCurrentState;

        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => handler());

        const getCurrentStateMock = Mock.ofType<Action<void>>();
        getCurrentStateMock.setup(action => action.invoke(null)).verifiable(Times.once());

        scopingActionsMock.setup(actions => actions['getCurrentState']).returns(() => getCurrentStateMock.object);

        testSubject.registerCallback();

        getCurrentStateMock.verifyAll();
    });

    it('handles AddSelector', () => {
        const expectedMessage = Messages.Scoping.AddSelector;

        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['html'],
        };

        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => handler(payload));

        const addSelectorMock = Mock.ofType<Action<ScopingPayload>>();
        addSelectorMock.setup(action => action.invoke(payload)).verifiable(Times.once());

        scopingActionsMock.setup(actions => actions['addSelector']).returns(() => addSelectorMock.object);

        testSubject.registerCallback();

        addSelectorMock.verifyAll();
    });

    it('handles DeleteSelector', () => {
        const expectedMessage = Messages.Scoping.DeleteSelector;

        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['html'],
        };

        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(expectedMessage, It.is(isFunction)))
            .callback((message, handler) => handler(payload));

        const deleteSelectorMock = Mock.ofType<Action<ScopingPayload>>();
        deleteSelectorMock.setup(action => action.invoke(payload)).verifiable(Times.once());

        scopingActionsMock.setup(actions => actions['deleteSelector']).returns(() => deleteSelectorMock.object);

        testSubject.registerCallback();

        deleteSelectorMock.verifyAll();
    });
});
