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
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createSyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('NeedsReviewCardSelectionActionCreator', () => {
    const tabId = -2;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        interpreterMock = new MockInterpreter();
    });

    it('handles card selection toggle', async () => {
        const payload: CardSelectionPayload = {
            resultInstanceUid: 'test-instance-uuid',
            ruleId: 'test-rule-id',
        };
        const toggleNeedsReviewCardSelectionMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleCardSelection',
            toggleNeedsReviewCardSelectionMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        toggleNeedsReviewCardSelectionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onRuleExpansionToggle', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'test-rule-id',
        };
        const ruleExpansionToggleMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.RuleExpansionToggled,
            payload,
            tabId,
        );

        ruleExpansionToggleMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.RULE_EXPANSION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onToggleVisualHelper', async () => {
        const payloadStub: BaseActionPayload = {};
        const toggleVisualHelperMock = createSyncActionMock(null);
        const actionsMock = createActionsMock('toggleVisualHelper', toggleVisualHelperMock.object);

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.ToggleVisualHelper,
            payloadStub,
            tabId,
        );

        toggleVisualHelperMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.VISUAL_HELPER_TOGGLED, payloadStub),
            Times.once(),
        );
    });

    test('onCollapseAllRules', async () => {
        const payloadStub: BaseActionPayload = {};
        const collapseAllRulesActionMock = createSyncActionMock(null);
        const actionsMock = createActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.CollapseAllRules,
            payloadStub,
            tabId,
        );

        collapseAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_COLLAPSED, payloadStub),
            Times.once(),
        );
    });

    test('onExpandAllRules', async () => {
        const payloadStub: BaseActionPayload = {};
        const expandAllRulesActionMock = createSyncActionMock(null);
        const actionsMock = createActionsMock('expandAllRules', expandAllRulesActionMock.object);

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

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
