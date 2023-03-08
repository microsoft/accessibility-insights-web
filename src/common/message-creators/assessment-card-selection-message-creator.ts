// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    AssessmentCardSelectionPayload,
    RuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { SupportedMouseEvent, TelemetryDataFactory } from 'common/telemetry-data-factory';

export class AssessmentCardSelectionMessageCreator implements CardSelectionMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
    ) {}

    public toggleCardSelection = (
        ruleId: string,
        resultInstanceUid: string,
        event: React.SyntheticEvent,
        testKey: string,
    ) => {
        const payload: AssessmentCardSelectionPayload = {
            testKey,
            resultInstanceUid,
            ruleId,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.AssessmentCardSelection.CardSelectionToggled,
            payload,
        });
    };

    public toggleRuleExpandCollapse = (ruleId: string, event: React.SyntheticEvent) => {
        const payload: RuleExpandCollapsePayload = {
            ruleId,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.AssessmentCardSelection.RuleExpansionToggled,
            payload,
        });
    };

    public collapseAllRules = (event: SupportedMouseEvent) => {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.AssessmentCardSelection.CollapseAllRules,
            payload,
        });
    };

    public expandAllRules = (event: SupportedMouseEvent) => {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.AssessmentCardSelection.ExpandAllRules,
            payload,
        });
    };

    public toggleVisualHelper = (event: SupportedMouseEvent) => {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.AssessmentCardSelection.ToggleVisualHelper,
            payload,
        });
    };
}
