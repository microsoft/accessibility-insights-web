// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentSingleRuleExpandCollapsePayload,
    AssessmentStoreChangedPayload,
} from 'background/actions/action-payloads';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { AssessmentCardSelectionMessages } from 'common/messages';
import { SupportedMouseEvent, TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';

export class AssessmentCardSelectionMessageCreator implements CardSelectionMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
        protected readonly messages: AssessmentCardSelectionMessages,
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
            messageType: this.messages.CardSelectionToggled,
            payload,
        });
    };

    public toggleRuleExpandCollapse = (
        ruleId: string,
        event: React.SyntheticEvent,
        testKey: string,
    ) => {
        const payload: AssessmentSingleRuleExpandCollapsePayload = {
            testKey,
            ruleId,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.RuleExpansionToggled,
            payload,
        });
    };

    public collapseAllRules = (event: SupportedMouseEvent, testKey: string) => {
        const payload: AssessmentExpandCollapsePayload = {
            testKey,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.CollapseAllRules,
            payload,
        });
    };

    public expandAllRules = (event: SupportedMouseEvent, testKey: string) => {
        const payload: AssessmentExpandCollapsePayload = {
            testKey,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.ExpandAllRules,
            payload,
        });
    };

    public toggleVisualHelper = (event: SupportedMouseEvent, testKey: string) => {
        const payload: AssessmentCardToggleVisualHelperPayload = {
            testKey,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(event, this.source),
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.ToggleVisualHelper,
            payload,
        });
    };

    public assessmentStoreChanged = (assessmentStoreData: AssessmentStoreData) => {
        const payload: AssessmentStoreChangedPayload = {
            assessmentStoreData,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.AssessmentStoreChanged,
            payload,
        });
    };
}
