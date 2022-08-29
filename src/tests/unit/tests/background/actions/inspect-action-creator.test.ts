// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectActionCreator } from 'background/actions/inspect-action-creator';
import { InspectActions, InspectPayload } from 'background/actions/inspect-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { CHANGE_INSPECT_MODE } from 'common/extension-telemetry-events';
import { AsyncAction } from 'common/flux/async-action';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('InspectActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let loggerMock: IMock<Logger>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>();
        interpreterMock = new MockInterpreter();
    });

    it('handles GetState message', async () => {
        const getCurrentStateMock = createAsyncActionMock(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);

        const testSubject = new InspectActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            browserAdapterMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(getStoreStateMessage(StoreNames.InspectStore), null);

        getCurrentStateMock.verifyAll();
    });

    describe('handles ChangeInspectMode message', () => {
        const payload: InspectPayload = {
            inspectMode: InspectMode.scopingAddInclude,
        };

        const tabId: number = -1;

        let changeInspectModeMock: IMock<AsyncAction<InspectPayload>>;
        let actionsMock: IMock<InspectActions>;

        let testSubject: InspectActionCreator;

        beforeEach(() => {
            telemetryEventHandlerMock
                .setup(publisher => publisher.publishTelemetry(CHANGE_INSPECT_MODE, payload))
                .verifiable(Times.once());

            changeInspectModeMock = createAsyncActionMock(payload);
            actionsMock = createActionsMock('changeInspectMode', changeInspectModeMock.object);

            testSubject = new InspectActionCreator(
                interpreterMock.object,
                actionsMock.object,
                telemetryEventHandlerMock.object,
                browserAdapterMock.object,
                loggerMock.object,
            );
        });

        it('switch to tab succeed', async () => {
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.resolve());

            testSubject.registerCallbacks();

            await interpreterMock.simulateMessage(
                Messages.Inspect.ChangeInspectMode,
                payload,
                tabId,
            );

            changeInspectModeMock.verifyAll();
        });

        it('logs error when switch to tab fails', async () => {
            const dummyError = 'test-dummy-error';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.reject(dummyError));

            testSubject.registerCallbacks();

            await interpreterMock.simulateMessage(
                Messages.Inspect.ChangeInspectMode,
                payload,
                tabId,
            );

            changeInspectModeMock.verifyAll();
            loggerMock.verify(
                logger => logger.error(`switchToTab failed`, dummyError),
                Times.once(),
            );
        });
    });

    function createActionsMock<ActionName extends keyof InspectActions>(
        actionName: ActionName,
        action: InspectActions[ActionName],
    ): IMock<InspectActions> {
        const actionsMock = Mock.ofType<InspectActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
