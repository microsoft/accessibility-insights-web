// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { PathSnippetActionCreator } from '../../../../../background/actions/path-snippet-action-creator';
import { PathSnippetActions } from '../../../../../background/actions/path-snippet-actions';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';

describe('PathSnippetActionCreatorTest', () => {
    let pathSnippetActionsMock: IMock<PathSnippetActions>;
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;

    let testObject: PathSnippetActionCreator;

    beforeAll(() => {
        pathSnippetActionsMock = Mock.ofType(PathSnippetActions, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((_type, _callback) => {});

        testObject = new PathSnippetActionCreator(pathSnippetActionsMock.object, registerTypeToPayloadCallbackMock.object);
    });

    test('registerCallbacks for onAddPathForValidation', () => {
        const path = 'test path';
        const actionName = 'onAddPath';

        const payload = path;
        const addPathForValidationMock = createActionMock(payload);

        setupPathSnippetActionMock(actionName, addPathForValidationMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.PathSnippet.AddPathForValidation, payload);

        testObject.registerCallbacks();
        addPathForValidationMock.verifyAll();
    });

    test('registerCallbacks for onAddCorrespondingSnippet', () => {
        const snippet = 'test corresponding snippet';
        const actionName = 'onAddSnippet';

        const payload = snippet;
        const addCorrespondingSnippetMock = createActionMock(payload);

        setupPathSnippetActionMock(actionName, addCorrespondingSnippetMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.PathSnippet.AddCorrespondingSnippet, payload);

        testObject.registerCallbacks();
        addCorrespondingSnippetMock.verifyAll();
    });

    function createActionMock<TPayload>(actionPayload: TPayload): IMock<Action<TPayload>> {
        const getCurrentStateMock = Mock.ofType<Action<TPayload>>(Action, MockBehavior.Strict);
        getCurrentStateMock.setup(action => action.invoke(actionPayload)).verifiable(Times.once());

        return getCurrentStateMock;
    }

    function setupPathSnippetActionMock(actionName: keyof PathSnippetActions, actionMock: IMock<Action<any>>): void {
        pathSnippetActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any): void {
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(_.isFunction)))
            .callback((_message, listener) => listener(payload));
    }
});
