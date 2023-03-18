// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentSingleRuleExpandCollapsePayload,
    AssessmentStoreChangedPayload,
} from 'background/actions/action-payloads';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { QuickAssessCardSelectionActionCreator } from 'background/actions/quick-assess-card-selection-action-creator';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { AssessmentNavState } from 'common/types/store-data/assessment-result-data';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('QuickAssessCardSelectionActionCreator', () => {
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
        const toggleQuickAssessCardSelectionMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'toggleCardSelection',
            toggleQuickAssessCardSelectionMock.object,
        );

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        toggleQuickAssessCardSelectionMock.verifyAll();
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

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.RuleExpansionToggled,
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
        const toggleVisualHelperMock = createAsyncActionMock(payloadStub);
        const actionsMock = createActionsMock('toggleVisualHelper', toggleVisualHelperMock.object);

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.ToggleVisualHelper,
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
        const collapseAllRulesActionMock = createAsyncActionMock(payloadStub);
        const actionsMock = createActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.CollapseAllRules,
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
        const expandAllRulesActionMock = createAsyncActionMock(payloadStub);
        const actionsMock = createActionsMock('expandAllRules', expandAllRulesActionMock.object);

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

        expandAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payloadStub),
            Times.once(),
        );
    });

    test('onAssessmentStoreChanged', async () => {
        const payloadStub: AssessmentStoreChangedPayload = {
            assessmentStoreData: {
                assessments: {},
                persistedTabInfo: {},
                assessmentNavState: {} as AssessmentNavState,
                resultDescription: 'sample-description',
            },
        };
        const assessmentStoreChangedMock = createAsyncActionMock(payloadStub);
        const actionsMock = createActionsMock(
            'assessmentStoreChanged',
            assessmentStoreChangedMock.object,
        );

        const testSubject = new QuickAssessCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.QuickAssessCardSelection.AssessmentStoreChanged,
            payloadStub,
            tabId,
        );

        assessmentStoreChangedMock.verifyAll();
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
