// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActionCreator } from 'background/actions/path-snippet-action-creator';
import { PathSnippetActions } from 'background/actions/path-snippet-actions';
import { IMock, Mock } from 'typemoq';

import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    createSyncActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('PathSnippetActionCreatorTest', () => {
    it('handles AddPathForValidation message', () => {
        const payload = 'test path';

        const onAddPathMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('onAddPath', onAddPathMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.PathSnippet.AddPathForValidation,
            payload,
        );

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        onAddPathMock.verifyAll();
    });

    it('handles AddCorrespondingSnippet message', () => {
        const payload = 'test snippet';

        const onAddSnippetMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('onAddSnippet', onAddSnippetMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.PathSnippet.AddCorrespondingSnippet,
            payload,
        );

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        onAddSnippetMock.verifyAll();
    });

    it('handles GetPathSnippetCurrentState message', () => {
        const getCurrentStateMock = createSyncActionMock(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.PathSnippetStore),
            null,
        );

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it('handles ClearPathSnippetData message', () => {
        const onClearDataMock = createSyncActionMock(undefined);
        const actionsMock = createActionsMock('onClearData', onClearDataMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.PathSnippet.ClearPathSnippetData,
            null,
        );

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        onClearDataMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof PathSnippetActions>(
        actionName: ActionName,
        action: PathSnippetActions[ActionName],
    ): IMock<PathSnippetActions> {
        const actionsMock = Mock.ofType<PathSnippetActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
