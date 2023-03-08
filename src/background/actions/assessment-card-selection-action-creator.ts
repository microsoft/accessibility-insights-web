// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from 'common/stores/store-names';

import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AssessmentCardSelectionPayload,
    BaseActionPayload,
    RuleExpandCollapsePayload,
} from './action-payloads';
import { CardSelectionActions as AssessmentCardSelectionActions } from './card-selection-actions';

export class AssessmentCardSelectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly assessmentCardSelectionActions: AssessmentCardSelectionActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.AssessmentCardSelection.CardSelectionToggled,
            this.onAssessmentCardSelectionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.AssessmentCardSelection.RuleExpansionToggled,
            this.onRuleExpansionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.AssessmentCardSelectionStore),
            this.onGetCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.AssessmentCardSelection.ToggleVisualHelper,
            this.onToggleVisualHelper,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.AssessmentCardSelection.ExpandAllRules,
            this.onExpandAllRules,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.AssessmentCardSelection.CollapseAllRules,
            this.onCollapseAllRules,
        );
    }

    private onGetCurrentState = async (): Promise<void> => {
        await this.assessmentCardSelectionActions.getCurrentState.invoke(null);
    };

    private onAssessmentCardSelectionToggle = async (
        payload: AssessmentCardSelectionPayload,
    ): Promise<void> => {
        await this.assessmentCardSelectionActions.toggleCardSelection.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.CARD_SELECTION_TOGGLED,
            payload,
        );
    };

    private onRuleExpansionToggle = async (payload: RuleExpandCollapsePayload): Promise<void> => {
        await this.assessmentCardSelectionActions.toggleRuleExpandCollapse.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.RULE_EXPANSION_TOGGLED,
            payload,
        );
    };

    private onToggleVisualHelper = async (payload: BaseActionPayload): Promise<void> => {
        await this.assessmentCardSelectionActions.toggleVisualHelper.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.VISUAL_HELPER_TOGGLED, payload);
    };

    private onCollapseAllRules = async (payload: BaseActionPayload): Promise<void> => {
        await this.assessmentCardSelectionActions.collapseAllRules.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_COLLAPSED, payload);
    };

    private onExpandAllRules = async (payload: BaseActionPayload): Promise<void> => {
        await this.assessmentCardSelectionActions.expandAllRules.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payload);
    };
}
