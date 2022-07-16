// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionActionCreator } from 'background/actions/injection-action-creator';
import { InjectionActions } from 'background/actions/injection-actions';
import { Messages } from 'common/messages';
import {
    createAsyncActionMock,
    createAsyncInterpreterMock,
} from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { IMock, Mock } from 'typemoq';

describe('InjectionActionCreator', () => {
    it('handles InjectionStarted message', () => {
        const injectionStartedMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('injectionStarted', injectionStartedMock.object);
        const interpreterMock = createAsyncInterpreterMock(
            Messages.Visualizations.State.InjectionStarted,
            null,
        );

        const testSubject = new InjectionActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallbacks();

        injectionStartedMock.verifyAll();
    });

    it('handles InjectionCompleted message', () => {
        const injectionCompletedMock = createAsyncActionMock<void>(null);
        const actionsMock = createActionsMock('injectionCompleted', injectionCompletedMock.object);
        const interpreterMock = createAsyncInterpreterMock(
            Messages.Visualizations.State.InjectionCompleted,
            null,
        );

        const testSubject = new InjectionActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallbacks();

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
