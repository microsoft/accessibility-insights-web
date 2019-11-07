// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload } from 'background/actions/action-payloads';
import { CardSelectionActionCreator } from 'background/actions/card-selection-action-creator';
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';

describe('CardSelectionActionCreator', () => {
    const tabId = -2;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('handles card selection toggle', () => {
        const payload: CardSelectionPayload = {
            resultInstanceUid: 'test-instance-uuid',
            ruleId: 'test-rule-id',
        };
        const toggleCardSelectionMock = createActionMock(payload);
        const actionsMock = createActionsMock('toggleCardSelection', toggleCardSelectionMock.object);
        const interpreterMock = createInterpreterMock(Messages.CardSelection.CardSelectionToggled, payload, tabId);

        const testSubject = new CardSelectionActionCreator(interpreterMock.object, actionsMock.object, telemetryEventHandlerMock.object);

        testSubject.registerCallbacks();

        toggleCardSelectionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onToggleVisualHelper', () => {
        const actionMock = createActionMock(null);
        const actionsMock = createActionsMock('toggleVisualHelper', actionMock.object);
        const interpreterMock = createInterpreterMock(Messages.CardSelection.ToggleVisualHelper, tabId);

        const testSubject = new CardSelectionActionCreator(interpreterMock.object, actionsMock.object, telemetryEventHandlerMock.object);

        testSubject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onCollapseAllRules', () => {
        const actionMock = createActionMock(null);
        const actionsMock = createActionsMock('collapseAllRules', actionMock.object);
        const interpreterMock = createInterpreterMock(Messages.CardSelection.CollapseAllRules, tabId);

        const testSubject = new CardSelectionActionCreator(interpreterMock.object, actionsMock.object, telemetryEventHandlerMock.object);

        testSubject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onExpandAllRules', () => {
        const actionMock = createActionMock(null);
        const actionsMock = createActionsMock('expandAllRules', actionMock.object);
        const interpreterMock = createInterpreterMock(Messages.CardSelection.ExpandAllRules, tabId);

        const testSubject = new CardSelectionActionCreator(interpreterMock.object, actionsMock.object, telemetryEventHandlerMock.object);

        testSubject.registerCallbacks();

        actionMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof CardSelectionActions>(
        actionName: ActionName,
        action: CardSelectionActions[ActionName],
    ): IMock<CardSelectionActions> {
        const actionsMock = Mock.ofType<CardSelectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
