// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateTabbingCompletedPayload,
    UpdateNeedToCollectTabbingResultsPayload,
} from 'background/actions/action-payloads';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import { TabStopRequirementStatus } from '../../common/types/store-data/visualization-scan-result-data';
const messages = Messages.Visualizations.TabStops;

export class TabStopRequirementActionMessageCreator extends DevToolActionMessageCreator {
    public addTabStopInstance(requirementId: TabStopRequirementId, description: string): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId);

        const payload: AddTabStopInstancePayload = {
            requirementId,
            description,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.AddTabStopInstance,
            payload,
        });
    }

    public updateTabStopInstance(
        requirementId: TabStopRequirementId,
        id: string,
        description: string,
    ): void {
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId);

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
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId);
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
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId);

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
        const telemetry = this.telemetryFactory.forTabStopRequirement(requirementId);

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
}
