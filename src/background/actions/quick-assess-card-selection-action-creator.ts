// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { StoreNames } from 'common/stores/store-names';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentSingleRuleExpandCollapsePayload,
} from './action-payloads';

export class QuickAssessCardSelectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly quickAssessCardSelectionActions: AssessmentCardSelectionActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.QuickAssessCardSelection.CardSelectionToggled,
            this.onQuickAssessCardSelectionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.QuickAssessCardSelection.RuleExpansionToggled,
            this.onRuleExpansionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.QuickAssessCardSelectionStore),
            this.onGetCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.QuickAssessCardSelection.ToggleVisualHelper,
            this.onToggleVisualHelper,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.QuickAssessCardSelection.ExpandAllRules,
            this.onExpandAllRules,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.QuickAssessCardSelection.CollapseAllRules,
            this.onCollapseAllRules,
        );
    }

    private onGetCurrentState = async (): Promise<void> => {
        await this.quickAssessCardSelectionActions.getCurrentState.invoke(null);
    };

    private onQuickAssessCardSelectionToggle = async (
        payload: AssessmentCardSelectionPayload,
    ): Promise<void> => {
        await this.quickAssessCardSelectionActions.toggleCardSelection.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.CARD_SELECTION_TOGGLED,
            payload,
        );
    };

    private onRuleExpansionToggle = async (
        payload: AssessmentSingleRuleExpandCollapsePayload,
    ): Promise<void> => {
        await this.quickAssessCardSelectionActions.toggleRuleExpandCollapse.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.RULE_EXPANSION_TOGGLED,
            payload,
        );
    };

    private onToggleVisualHelper = async (
        payload: AssessmentCardToggleVisualHelperPayload,
    ): Promise<void> => {
        await this.quickAssessCardSelectionActions.toggleVisualHelper.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.VISUAL_HELPER_TOGGLED, payload);
    };

    private onCollapseAllRules = async (
        payload: AssessmentExpandCollapsePayload,
    ): Promise<void> => {
        await this.quickAssessCardSelectionActions.collapseAllRules.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_COLLAPSED, payload);
    };

    private onExpandAllRules = async (payload: AssessmentExpandCollapsePayload): Promise<void> => {
        await this.quickAssessCardSelectionActions.expandAllRules.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payload);
    };
}
