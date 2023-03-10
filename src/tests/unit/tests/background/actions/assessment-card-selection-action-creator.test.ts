// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentSingleRuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { AssessmentCardSelectionActionCreator } from 'background/actions/assessment-card-selection-action-creator';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('AssessmentCardSelectionActionCreator', () => {
    const tabId = -2;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        interpreterMock = new MockInterpreter();
    });

    it('handles card selection toggle', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'sample-testKey',
            resultInstanceUid: 'test-instance-uuid',
            ruleId: 'test-rule-id',
        };
        const toggleAssessmentCardSelectionMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleCardSelection',
            toggleAssessmentCardSelectionMock.object,
        );

        const testSubject = new AssessmentCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.AssessmentCardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        toggleAssessmentCardSelectionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload),
            Times.once(),
        );
    });

    test('onRuleExpansionToggle', async () => {
        const payload: AssessmentSingleRuleExpandCollapsePayload = {
            ruleId: 'test-rule-id',
            testKey: 'sample-testKey',
        };
        const ruleExpansionToggleMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );

        const testSubject = new AssessmentCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.AssessmentCardSelection.RuleExpansionToggled,
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
        const payloadStub: AssessmentCardToggleVisualHelperPayload = {
            testKey: 'sample-testKey',
        };
        const toggleVisualHelperMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('toggleVisualHelper', toggleVisualHelperMock.object);

        const testSubject = new AssessmentCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.AssessmentCardSelection.ToggleVisualHelper,
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
        const payloadStub: AssessmentExpandCollapsePayload = {
            testKey: 'sample-testKey',
        };
        const collapseAllRulesActionMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );

        const testSubject = new AssessmentCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.AssessmentCardSelection.CollapseAllRules,
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
        const payloadStub: AssessmentExpandCollapsePayload = {
            testKey: 'sample-testKey',
        };
        const expandAllRulesActionMock = createAsyncActionMock(null);
        const actionsMock = createActionsMock('expandAllRules', expandAllRulesActionMock.object);

        const testSubject = new AssessmentCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.AssessmentCardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

        expandAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payloadStub),
            Times.once(),
        );
    });

    function createActionsMock<ActionName extends keyof AssessmentCardSelectionActions>(
        actionName: ActionName,
        action: AssessmentCardSelectionActions[ActionName],
    ): IMock<AssessmentCardSelectionActions> {
        const actionsMock = Mock.ofType<AssessmentCardSelectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
