// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabStopInstanceArrayPayload,
    AddTabStopInstancePayload,
    BaseActionPayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from 'background/actions/action-payloads';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import {
    AutomatedTabStopRequirementResult,
    TabStopRequirementResult,
} from 'injected/tab-stop-requirement-result';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import { TabStopRequirementStatus } from '../../common/types/store-data/visualization-scan-result-data';

const messages = Messages.Visualizations.TabStops;

export class TabStopRequirementActionMessageCreator extends DevToolActionMessageCreator {
    constructor(
        protected readonly telemetryFactory: TelemetryDataFactory,
        protected readonly dispatcher: ActionMessageDispatcher,
        private readonly source: TelemetryEventSource,
    ) {
        super(telemetryFactory, dispatcher);
    }
    public addTabStopInstance(tabStopRequirementResult: TabStopRequirementResult): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(
            tabStopRequirementResult.requirementId,
            this.source,
        );

        const payload: AddTabStopInstancePayload = {
            ...tabStopRequirementResult,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.AddTabStopInstance,
            payload,
        });
    }

    public addTabStopInstanceArray(results: TabStopRequirementResult[]): void {
        const resultsWithTelemetry = results.map(result => {
            const telemetry = this.telemetryFactory.forTabStopRequirement(
                result.requirementId,
                this.source,
            );

            return {
                ...result,
                telemetry,
            };
        });

        const payload: AddTabStopInstanceArrayPayload = {
            results: resultsWithTelemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.AddTabStopInstanceArray,
            payload,
        });
    }

    public updateTabStopInstance(
        requirementId: TabStopRequirementId,
        id: string,
        description: string,
    ): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId, this.source);

        const payload: UpdateTabStopInstancePayload = {
            requirementId,
            description,
            id,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.UpdateTabStopInstance,
            payload,
        });
    }

    public removeTabStopInstance(requirementId: TabStopRequirementId, id: string): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId, this.source);
        const payload: RemoveTabStopInstancePayload = {
            requirementId,
            id,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.RemoveTabStopInstance,
            payload,
        });
    }

    public updateTabStopRequirementStatus(
        requirementId: TabStopRequirementId,
        status: TabStopRequirementStatus,
    ): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId, this.source);

        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId,
            status,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.UpdateTabStopsRequirementStatus,
            payload,
        });
    }

    public resetStatusForRequirement(requirementId: TabStopRequirementId): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId, this.source);

        const payload: ResetTabStopRequirementStatusPayload = {
            requirementId,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.ResetTabStopsRequirementStatus,
            payload,
        });
    }

    public toggleTabStopRequirementExpand = (
        requirementId: TabStopRequirementId,
        event: React.SyntheticEvent,
    ) => {
        const payload: ToggleTabStopRequirementExpandPayload = {
            requirementId,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.TabStops.RequirementExpansionToggled,
            payload,
        });
    };

    public updateTabbingCompleted = (tabbingCompleted: boolean) => {
        const payload: UpdateTabbingCompletedPayload = {
            tabbingCompleted,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.TabStops.TabbingCompleted,
            payload,
        });
    };

    public updateNeedToCollectTabbingResults = (needToCollectTabbingResults: boolean) => {
        const payload: UpdateNeedToCollectTabbingResultsPayload = {
            needToCollectTabbingResults,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.TabStops.NeedToCollectTabbingResults,
            payload,
        });
    };

    public automatedTabbingResultsCompleted = (results: AutomatedTabStopRequirementResult[]) => {
        const telemetry = this.telemetryFactory.forAutomatedTabStopsResults(results, this.source);
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.TabStops.AutomatedTabbingResultsCompleted,
            payload,
        });
    };
}
