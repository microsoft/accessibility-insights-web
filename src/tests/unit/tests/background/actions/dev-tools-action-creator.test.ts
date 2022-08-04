// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectElementPayload, InspectFrameUrlPayload } from 'background/actions/action-payloads';
import { DevToolsActionCreator } from 'background/actions/dev-tools-action-creator';
import { DevToolActions } from 'background/actions/dev-tools-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('DevToolsActionCreatorTest', () => {
    const tabId: number = -1;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        interpreterMock = new MockInterpreter();
    });

    it('handles DevToolOpened message', async () => {
        const setDevToolsStateMock = createAsyncActionMock(true);
        const actionsMock = createActionsMock('setDevToolState', setDevToolsStateMock.object);

        const newTestObject = new DevToolsActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.DevTools.Opened, null, tabId);

        setDevToolsStateMock.verifyAll();
    });

    it('handles DevToolClosed message', async () => {
        const setDevToolsStateMock = createAsyncActionMock(false);
        const actionsMock = createActionsMock('setDevToolState', setDevToolsStateMock.object);

        const newTestObject = new DevToolsActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.DevTools.Closed, undefined, tabId);

        setDevToolsStateMock.verifyAll();
    });

    it('handles GetState message', async () => {
        const getCurrentStateMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);

        const newTestObject = new DevToolsActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        newTestObject.registerCallbacks();
        await interpreterMock.simulateMessage(
            getStoreStateMessage(StoreNames.DevToolsStore),
            null,
            tabId,
        );

        getCurrentStateMock.verifyAll();
    });

    it('handles InspectFrameUrl message', async () => {
        const payload: InspectFrameUrlPayload = {
            frameUrl: 'frame-url',
        };

        const setFrameUrlMock = createAsyncActionMock(payload.frameUrl);
        const actionsMock = createActionsMock('setFrameUrl', setFrameUrlMock.object);

        const newTestObject = new DevToolsActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.DevTools.InspectFrameUrl, payload, tabId);

        setFrameUrlMock.verifyAll();
    });

    it('handles InspectElement message', async () => {
        const payload: InspectElementPayload = {
            target: ['target'],
        };

        telemetryEventHandlerMock
            .setup(publisher => publisher.publishTelemetry(TelemetryEvents.INSPECT_OPEN, payload))
            .verifiable(Times.once());

        const setInspectElementMock = createAsyncActionMock(payload.target);
        const actionsMock = createActionsMock('setInspectElement', setInspectElementMock.object);

        const newTestObject = new DevToolsActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        newTestObject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.DevTools.InspectElement, payload, tabId);

        setInspectElementMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof DevToolActions>(
        actionName: ActionName,
        action: DevToolActions[ActionName],
    ): IMock<DevToolActions> {
        const actionsMock = Mock.ofType<DevToolActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
