// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionActionCreator } from 'background/actions/injection-action-creator';
import { InjectionActions } from 'background/actions/injection-actions';
import { Messages } from 'common/messages';
import { createAsyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock } from 'typemoq';

describe('InjectionActionCreator', () => {
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        interpreterMock = new MockInterpreter();
    });

    it('handles InjectionStarted message', async () => {
        const injectionStartedMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('injectionStarted', injectionStartedMock.object);

        const testSubject = new InjectionActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Visualizations.State.InjectionStarted, null);

        injectionStartedMock.verifyAll();
    });

    it('handles InjectionCompleted message', async () => {
        const injectionCompletedMock = createAsyncActionMock<void>(null);
        const actionsMock = createActionsMock('injectionCompleted', injectionCompletedMock.object);

        const testSubject = new InjectionActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.State.InjectionCompleted,
            null,
        );

        injectionCompletedMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof InjectionActions>(
        actionName: ActionName,
        action: InjectionActions[ActionName],
    ): IMock<InjectionActions> {
        const actionsMock = Mock.ofType<InjectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
