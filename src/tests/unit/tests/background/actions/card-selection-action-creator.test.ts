// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    VisualizationTogglePayload,
} from 'background/actions/action-payloads';
import { CardSelectionActionCreator } from 'background/actions/card-selection-action-creator';
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationType } from 'common/types/visualization-type';

describe('CardSelectionActionCreator', () => {
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
        const toggleCardSelectionMock = createAsyncActionMock(payload);
        const actionsMock = createCardSelectionActionsMock(
            'toggleCardSelection',
            toggleCardSelectionMock.object,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.CardSelection.CardSelectionToggled,
            payload,
            tabId,
        );

        toggleCardSelectionMock.verifyAll();
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
        const actionsMock = createCardSelectionActionsMock(
            'toggleRuleExpandCollapse',
            ruleExpansionToggleMock.object,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.CardSelection.RuleExpansionToggled,
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
        const actionsMock = createCardSelectionActionsMock(
            'toggleVisualHelper',
            toggleVisualHelperMock.object,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.CardSelection.ToggleVisualHelper,
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
            Messages.CardSelection.ToggleVisualHelper,
            payloadStub,
            tabId,
        );
        visualizationActionsMock.verify(actions => actions['disableVisualization'], Times.once());
    });

    test('onCollapseAllRules', async () => {
        const payloadStub: BaseActionPayload = {};
        const collapseAllRulesActionMock = createAsyncActionMock(null);
        const actionsMock = createCardSelectionActionsMock(
            'collapseAllRules',
            collapseAllRulesActionMock.object,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.CardSelection.CollapseAllRules,
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
        const actionsMock = createCardSelectionActionsMock(
            'expandAllRules',
            expandAllRulesActionMock.object,
        );

        const testSubject = new CardSelectionActionCreator(
            interpreterMock.object,
            actionsMock.object,
            visualizationActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.CardSelection.ExpandAllRules,
            payloadStub,
            tabId,
        );

        expandAllRulesActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payloadStub),
            Times.once(),
        );
    });

    function createCardSelectionActionsMock<ActionName extends keyof CardSelectionActions>(
        actionName: ActionName,
        action: CardSelectionActions[ActionName],
    ): IMock<CardSelectionActions> {
        const actionsMock = Mock.ofType<CardSelectionActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }

    function createVisualizationActionsMock<
        ActionName extends keyof VisualizationActions,
    >(): IMock<VisualizationActions> {
        const actionsMock = Mock.ofType<VisualizationActions>();
        const payload = {
            test: VisualizationType.Issues,
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
