// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { NeedsReviewCardSelectionActionCreator } from 'background/actions/needs-review-card-selection-action-creator';
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('NeedsReviewCardSelectionActionCreator', () => {
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
        const toggleNeedsReviewCardSelectionMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleCardSelection',
            toggleNeedsReviewCardSelectionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.NeedsReviewCardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        toggleNeedsReviewCardSelectionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onRuleExpansionToggle', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'test-rule-id',
        };
        const ruleExpansionToggleMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.NeedsReviewCardSelection.RuleExpansionToggled,
            payload,
            tabId,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
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
        const toggleVisualHelperMock = createActionMock(null);
        const actionsMock = createActionsMock('toggleVisualHelper', toggleVisualHelperMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.NeedsReviewCardSelection.ToggleVisualHelper,
            payloadStub,
            tabId,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
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
        const collapseAllRulesActionMock = createActionMock(null);
        const actionsMock = createActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.NeedsReviewCardSelection.CollapseAllRules,
            payloadStub,
            tabId,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
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
        const expandAllRulesActionMock = createActionMock(null);
        const actionsMock = createActionsMock('expandAllRules', expandAllRulesActionMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.NeedsReviewCardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
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

    function createActionsMock<ActionName extends keyof NeedsReviewCardSelectionActions>(
        actionName: ActionName,
        action: NeedsReviewCardSelectionActions[ActionName],
    ): IMock<NeedsReviewCardSelectionActions> {
        const actionsMock = Mock.ofType<NeedsReviewCardSelectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
