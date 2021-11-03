// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
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

    public undoStatusForRequirement(_: TabStopRequirementId): void {}
}
