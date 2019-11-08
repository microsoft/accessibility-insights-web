// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload, CardSelectionPayload, RuleExpandCollapsePayload } from 'background/actions/action-payloads';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';

export class CardSelectionMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
    ) {}

    public toggleCardSelection(ruleId: string, resultInstanceUid: string, event: React.SyntheticEvent): void {
        const payload: CardSelectionPayload = {
            resultInstanceUid,
            ruleId,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.CardSelectionToggled,
            payload,
        });
    }

    public toggleRuleExpandCollapse(ruleId: string, event: React.SyntheticEvent): void {
        const payload: RuleExpandCollapsePayload = {
            ruleId,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.RuleExpansionToggled,
            payload,
        });
    }

    public collapseAllRules(event: React.SyntheticEvent): void {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.CollapseAllRules,
            payload,
        });
    }

    public expandAllRules(event: React.SyntheticEvent): void {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.ExpandAllRules,
            payload,
        });
    }

    public toggleVisualHelper(event: React.SyntheticEvent): void {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.ToggleVisualHelper,
            payload,
        });
    }
}
