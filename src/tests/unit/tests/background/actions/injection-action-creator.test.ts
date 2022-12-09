// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionFailedPayload } from 'background/actions/action-payloads';
import { InjectionActionCreator } from 'background/actions/injection-action-creator';
import { InjectionActions } from 'background/actions/injection-actions';
import { Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { createAsyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, It, Mock, Times } from 'typemoq';

describe('InjectionActionCreator', () => {
    let interpreterMock: MockInterpreter;
    let notificationCreatorMock: IMock<NotificationCreator>;

    beforeEach(() => {
        interpreterMock = new MockInterpreter();
        notificationCreatorMock = Mock.ofType<NotificationCreator>();
    });
    afterEach(() => {
        notificationCreatorMock.verifyAll();
    });

    it('handles InjectionStarted message', async () => {
        const injectionStartedMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('injectionStarted', injectionStartedMock.object);
        setUpNotificationCreator();

        const testSubject = new InjectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            notificationCreatorMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Visualizations.State.InjectionStarted, null);

        injectionStartedMock.verifyAll();
    });

    it('handles InjectionCompleted message', async () => {
        const injectionCompletedMock = createAsyncActionMock<void>(null);
        const actionsMock = createActionsMock('injectionCompleted', injectionCompletedMock.object);
        setUpNotificationCreator();

        const testSubject = new InjectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            notificationCreatorMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.State.InjectionCompleted,
            null,
        );

        injectionCompletedMock.verifyAll();
    });

    it('handles InjectionFailed message', async () => {
        const payload = { failedAttempts: 1, injectionFailed: false } as InjectionFailedPayload;
        const injectionFailedMock = createAsyncActionMock<InjectionFailedPayload>(payload);
        const actionsMock = createActionsMock('injectionFailed', injectionFailedMock.object);
        setUpNotificationCreator();

        const testSubject = new InjectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            notificationCreatorMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.State.InjectionFailed,
            payload,
        );

        injectionFailedMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof InjectionActions>(
        actionName: ActionName,
        action: InjectionActions[ActionName],
    ): IMock<InjectionActions> {
        const actionsMock = Mock.ofType<InjectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }

    function setUpNotificationCreator(notificationText: string | null = null): void {
        if (notificationText) {
            notificationCreatorMock
                .setup(nc => nc.createNotification(notificationText))
                .verifiable(Times.once());
        } else {
            notificationCreatorMock
                .setup(nc => nc.createNotification(It.isAny()))
                .verifiable(Times.never());
        }
    }
});
