// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectActionCreator } from 'background/actions/inspect-action-creator';
import {
    InspectActions,
    InspectPayload,
} from 'background/actions/inspect-actions';
import { InspectMode } from 'background/inspect-modes';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('InspectActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let browserAdapterMock: IMock<BrowserAdapter>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(
            TelemetryEventHandler,
            MockBehavior.Strict,
        );
        browserAdapterMock = Mock.ofType<BrowserAdapter>(
            undefined,
            MockBehavior.Strict,
        );
    });

    it('handles GetState message', () => {
        const getCurrentStateMock = createActionMock(null);
        const actionsMock = createActionsMock(
            'getCurrentState',
            getCurrentStateMock.object,
        );
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.InspectStore),
            null,
        );

        const testSubject = new InspectActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            browserAdapterMock.object,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it('handles ChangeInspectMode message', () => {
        const payload: InspectPayload = {
            inspectMode: InspectMode.scopingAddInclude,
        };

        const tabId: number = -1;

        telemetryEventHandlerMock
            .setup(publisher =>
                publisher.publishTelemetry(
                    TelemetryEvents.CHANGE_INSPECT_MODE,
                    payload,
                ),
            )
            .verifiable(Times.once());

        browserAdapterMock
            .setup(ba => ba.switchToTab(tabId))
            .verifiable(Times.once());

        const changeInspectModeMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'changeInspectMode',
            changeInspectModeMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Inspect.ChangeInspectMode,
            payload,
            tabId,
        );

        const testSubject = new InspectActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            browserAdapterMock.object,
        );

        testSubject.registerCallbacks();

        changeInspectModeMock.verifyAll();
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
