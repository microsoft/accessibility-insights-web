// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    VisualizationTogglePayload,
} from 'background/actions/action-payloads';
import { NeedsReviewCardSelectionActionCreator } from 'background/actions/needs-review-card-selection-action-creator';
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationType } from 'common/types/visualization-type';

describe('NeedsReviewCardSelectionActionCreator', () => {
    const tabId = -2;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;
    let visualizationActionsMock: IMock<VisualizationActions>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        interpreterMock = new MockInterpreter();
        visualizationActionsMock = createVisualizationActionsMock();
    });

    it('handles card selection toggle', async () => {
        const payload: CardSelectionPayload = {
            resultInstanceUid: 'test-instance-uuid',
            ruleId: 'test-rule-id',
        };
        const toggleNeedsReviewCardSelectionMock = createAsyncActionMock(payload);
        const needsReviewActionsMock = createNeedsReviewActionsMock(
            'toggleCardSelection',
            toggleNeedsReviewCardSelectionMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            needsReviewActionsMock.object,
            visualizationActionsMock.object,
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
        const ruleExpansionToggleMock = createAsyncActionMock(payload);
        const actionsMock = createNeedsReviewActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
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
        const payloadStub: VisualizationTogglePayload = {
            test: VisualizationType.NeedsReview,
            enabled: false,
            telemetry: {
                enabled: false,
            } as TelemetryEvents.ToggleTelemetryData,
        };
        const toggleVisualHelperMock = createAsyncActionMock(null);
        const actionsMock = createNeedsReviewActionsMock(
            'toggleVisualHelper',
            toggleVisualHelperMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
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
        visualizationActionsMock.verify(actions => actions['enableVisualization'], Times.once());

        payloadStub.enabled = true;
        payloadStub.telemetry.enabled = true;
        await interpreterMock.simulateMessage(
            Messages.NeedsReviewCardSelection.ToggleVisualHelper,
            payloadStub,
            tabId,
        );
        visualizationActionsMock.verify(actions => actions['disableVisualization'], Times.once());
    });

    test('onCollapseAllRules', async () => {
        const payloadStub: BaseActionPayload = {};
        const collapseAllRulesActionMock = createAsyncActionMock(null);
        const actionsMock = createNeedsReviewActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
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
        const expandAllRulesActionMock = createAsyncActionMock(null);
        const actionsMock = createNeedsReviewActionsMock(
            'expandAllRules',
            expandAllRulesActionMock.object,
        );

        const testSubject = new NeedsReviewCardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
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

    function createNeedsReviewActionsMock<ActionName extends keyof NeedsReviewCardSelectionActions>(
        actionName: ActionName,
        action: NeedsReviewCardSelectionActions[ActionName],
    ): IMock<NeedsReviewCardSelectionActions> {
        const actionsMock = Mock.ofType<NeedsReviewCardSelectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }

    function createVisualizationActionsMock<
        ActionName extends keyof VisualizationActions,
    >(): IMock<VisualizationActions> {
        const actionsMock = Mock.ofType<VisualizationActions>();
        const payload = {
            test: VisualizationType.NeedsReview,
            enabled: true,
            telemetry: {
                enabled: true,
            },
        };
        const enableVisualizationMock = createAsyncActionMock(payload);
        const disableVisualizationMock = createAsyncActionMock(payload.test);
        actionsMock
            .setup(actions => actions['enableVisualization'])
            .returns(() => enableVisualizationMock.object);
        actionsMock
            .setup(actions => actions['disableVisualization'])
            .returns(() => disableVisualizationMock.object);
        return actionsMock;
    }
});
