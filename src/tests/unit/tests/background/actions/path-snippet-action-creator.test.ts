// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActionCreator } from 'background/actions/path-snippet-action-creator';
import { PathSnippetActions } from 'background/actions/path-snippet-actions';
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('PathSnippetActionCreatorTest', () => {
    let pathSnippetActionsMock: IMock<PathSnippetActions>;
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;

    let testObject: PathSnippetActionCreator;

    beforeAll(() => {
        pathSnippetActionsMock = Mock.ofType(PathSnippetActions, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((payloadType, callback) => {});

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

    test('registerCallbacks for onGetPathSnippetCurrentState', () => {
        const actionName = 'getCurrentState';

        const getPathSnippetCurrentStateMock = createActionMock(null);

        setupPathSnippetActionMock(actionName, getPathSnippetCurrentStateMock);
        setupRegisterTypeToPayloadCallbackMock(getStoreStateMessage(StoreNames.PathSnippetStore), null);

        testObject.registerCallbacks();
        getPathSnippetCurrentStateMock.verifyAll();
    });

    test('registerCallbacks for onClearPathSnippetData', () => {
        const actionName = 'onClearData';

        const clearPathSnippetDataMock = createActionMock(null);

        setupPathSnippetActionMock(actionName, clearPathSnippetDataMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.PathSnippet.ClearPathSnippetData, null);

        testObject.registerCallbacks();
        clearPathSnippetDataMock.verifyAll();
    });

    function setupPathSnippetActionMock(actionName: keyof PathSnippetActions, actionMock: IMock<Action<any>>): void {
        pathSnippetActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any): void {
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(_.isFunction)))
            .callback((passedMessage, listener) => listener(payload));
    }
});
