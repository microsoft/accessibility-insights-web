// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    UpdateTabStopRequirementStatusPayload,
    AddTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    RemoveTabStopInstancePayload,
} from 'background/actions/action-payloads';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import { TabStopRequirementStatus } from '../../common/types/store-data/visualization-scan-result-data';
const messages = Messages.Visualizations.TabStops;

export class DetailsViewActionMessageCreator extends DevToolActionMessageCreator {
    public addTabStopInstance(requirementId: TabStopRequirementId, description: string): void {
        const payload: AddTabStopInstancePayload = {
            requirementId,
            description,
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
        const payload: UpdateTabStopInstancePayload = {
            requirementId,
            description,
            id,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.UpdateTabStopInstance,
            payload,
        });
    }

    public removeTabStopInstance(requirementId: TabStopRequirementId, id: string): void {
        const payload: RemoveTabStopInstancePayload = {
            requirementId,
            id,
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
        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId,
            status,
        };

        this.dispatcher.dispatchMessage({
            messageType: messages.UpdateTabStopsRequirementStatus,
            payload,
        });
    }
}
