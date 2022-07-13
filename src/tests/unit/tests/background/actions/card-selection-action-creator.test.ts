// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { CardSelectionActionCreator } from 'background/actions/card-selection-action-creator';
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

import {
    createSyncActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

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
        const toggleCardSelectionMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleCardSelection',
            toggleCardSelectionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.CardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        toggleCardSelectionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onRuleExpansionToggle', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'test-rule-id',
        };
        const ruleExpansionToggleMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.CardSelection.RuleExpansionToggled,
            payload,
            tabId,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        ruleExpansionToggleMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.RULE_EXPANSION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onToggleVisualHelper', () => {
        const payloadStub: BaseActionPayload = {};
        const toggleVisualHelperMock = createSyncActionMock(null);
        const actionsMock = createActionsMock('toggleVisualHelper', toggleVisualHelperMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.CardSelection.ToggleVisualHelper,
            payloadStub,
            tabId,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        toggleVisualHelperMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.VISUAL_HELPER_TOGGLED, payloadStub),
            Times.once(),
        );
    });

    test('onCollapseAllRules', () => {
        const payloadStub: BaseActionPayload = {};
        const collapseAllRulesActionMock = createSyncActionMock(null);
        const actionsMock = createActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.CardSelection.CollapseAllRules,
            payloadStub,
            tabId,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        collapseAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_COLLAPSED, payloadStub),
            Times.once(),
        );
    });

    test('onExpandAllRules', () => {
        const payloadStub: BaseActionPayload = {};
        const expandAllRulesActionMock = createSyncActionMock(null);
        const actionsMock = createActionsMock('expandAllRules', expandAllRulesActionMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.CardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        expandAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payloadStub),
            Times.once(),
        );
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
