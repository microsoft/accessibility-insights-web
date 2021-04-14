// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectActionCreator } from 'background/actions/inspect-action-creator';
import { InspectActions, InspectPayload } from 'background/actions/inspect-actions';
import { InspectMode } from 'background/inspect-modes';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { CHANGE_INSPECT_MODE } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { tick } from 'tests/unit/common/tick';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('InspectActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>();
    });

    it('handles GetState message', () => {
        const getCurrentStateMock = createActionMock(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.InspectStore),
            null,
        );

        const testSubject = new InspectActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            browserAdapterMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    describe('handles ChangeInspectMode message', () => {
        const payload: InspectPayload = {
            inspectMode: InspectMode.scopingAddInclude,
        };

        const tabId: number = -1;

        let changeInspectModeMock: IMock<Action<InspectPayload>>;
        let actionsMock: IMock<InspectActions>;
        let interpreterMock: IMock<Interpreter>;

        let testSubject: InspectActionCreator;

        beforeEach(() => {
            telemetryEventHandlerMock
                .setup(publisher => publisher.publishTelemetry(CHANGE_INSPECT_MODE, payload))
                .verifiable(Times.once());

            changeInspectModeMock = createActionMock(payload);
            actionsMock = createActionsMock('changeInspectMode', changeInspectModeMock.object);
            interpreterMock = createInterpreterMock(
                Messages.Inspect.ChangeInspectMode,
                payload,
                tabId,
            );

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

            await tick();

            changeInspectModeMock.verifyAll();
        });

        it('logs error when switch to tab fails', async () => {
            const dummyError = 'test-dummy-error';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.reject(dummyError));

            testSubject.registerCallbacks();

            await tick();

            changeInspectModeMock.verifyAll();
            loggerMock.verify(
                logger => logger.error(`switchToTab failed: ${dummyError}`),
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
