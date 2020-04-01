// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ScopingActions } from 'background/actions/scoping-actions';
import { ScopingPanelActionCreator } from 'background/actions/scoping-panel-action-creator';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SCOPING_CLOSE } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('ScopingPanelActionCreatorTest', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let actionsMocks: IMock<ScopingActions>;
    let interpreterMock: IMock<Interpreter>;

    let testObject: ScopingPanelActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
    });

    test('handles ClosePanel message', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(SCOPING_CLOSE, payload))
            .verifiable(Times.once());

        const closeScopingPanelActionMock = createActionMock(null);
        actionsMocks = createActionsMock('closeScopingPanel', closeScopingPanelActionMock.object);
        interpreterMock = createInterpreterMock(Messages.Scoping.ClosePanel, payload);

        testObject = new ScopingPanelActionCreator(
            interpreterMock.object,
            actionsMocks.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallbacks();

        closeScopingPanelActionMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof ScopingActions>(
        actionName: ActionName,
        action: ScopingActions[ActionName],
    ): IMock<ScopingActions> {
        const actionsMock = Mock.ofType<ScopingActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
