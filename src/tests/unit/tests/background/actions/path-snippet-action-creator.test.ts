// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActionCreator } from 'background/actions/path-snippet-action-creator';
import { PathSnippetActions } from 'background/actions/path-snippet-actions';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock } from 'typemoq';

import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('PathSnippetActionCreatorTest', () => {
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        interpreterMock = new MockInterpreter();
    });

    it('handles AddPathForValidation message', async () => {
        const payload = 'test path';

        const onAddPathMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock('onAddPath', onAddPathMock.object);

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.PathSnippet.AddPathForValidation, payload);

        onAddPathMock.verifyAll();
    });

    it('handles AddCorrespondingSnippet message', async () => {
        const payload = 'test snippet';

        const onAddSnippetMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock('onAddSnippet', onAddSnippetMock.object);

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.PathSnippet.AddCorrespondingSnippet,
            payload,
        );

        onAddSnippetMock.verifyAll();
    });

    it('handles GetPathSnippetCurrentState message', async () => {
        const getCurrentStateMock = createAsyncActionMock(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(
            getStoreStateMessage(StoreNames.PathSnippetStore),
            null,
        );

        getCurrentStateMock.verifyAll();
    });

    it('handles ClearPathSnippetData message', async () => {
        const onClearDataMock = createAsyncActionMock(undefined);
        const actionsMock = createActionsMock('onClearData', onClearDataMock.object);

        const newTestObject = new PathSnippetActionCreator(
            interpreterMock.object,
            actionsMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.PathSnippet.ClearPathSnippetData, null);

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
