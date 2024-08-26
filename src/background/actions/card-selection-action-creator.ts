// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from 'common/stores/store-names';

import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { CardSelectionActions } from '../actions/card-selection-actions';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    VisualizationTogglePayload,
} from './action-payloads';
import { VisualizationActions } from 'background/actions/visualization-actions';

export class CardSelectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly cardSelectionActions: CardSelectionActions,
        private readonly visualizationActions: VisualizationActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.CardSelection.CardSelectionToggled,
            this.onCardSelectionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.CardSelection.RuleExpansionToggled,
            this.onRuleExpansionToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.CardSelectionStore),
            this.onGetCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.CardSelection.ToggleVisualHelper,
            this.onToggleVisualHelper,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.CardSelection.ExpandAllRules,
            this.onExpandAllRules,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.CardSelection.CollapseAllRules,
            this.onCollapseAllRules,
        );
    }

    private onGetCurrentState = async (): Promise<void> => {
        await this.cardSelectionActions.getCurrentState.invoke(null);
    };

    private onCardSelectionToggle = async (payload: CardSelectionPayload): Promise<void> => {
        await this.cardSelectionActions.toggleCardSelection.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.CARD_SELECTION_TOGGLED,
            payload,
        );
    };

    private onRuleExpansionToggle = async (payload: RuleExpandCollapsePayload): Promise<void> => {
        await this.cardSelectionActions.toggleRuleExpandCollapse.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.RULE_EXPANSION_TOGGLED,
            payload,
        );
    };

    private onToggleVisualHelper = async (payload: VisualizationTogglePayload): Promise<void> => {
        await this.cardSelectionActions.toggleVisualHelper.invoke(null);
        if (payload.enabled) {
            await this.visualizationActions.disableVisualization.invoke(payload.test);
        } else {
            await this.visualizationActions.enableVisualization.invoke(payload);
        }
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.VISUAL_HELPER_TOGGLED, payload);
    };

    private onCollapseAllRules = async (payload: BaseActionPayload): Promise<void> => {
        await this.cardSelectionActions.collapseAllRules.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_COLLAPSED, payload);
    };

    private onExpandAllRules = async (payload: BaseActionPayload): Promise<void> => {
        await this.cardSelectionActions.expandAllRules.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ALL_RULES_EXPANDED, payload);
    };
}
