// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import {
    AddTabStopInstancePayload,
    BaseActionPayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from './action-payloads';

export class TabStopRequirementActions {
    public readonly getCurrentState = new SyncAction();
    public readonly updateTabStopsRequirementStatus =
        new SyncAction<UpdateTabStopRequirementStatusPayload>();
    public readonly addTabStopInstance = new SyncAction<AddTabStopInstancePayload>();
    public readonly updateTabStopInstance = new SyncAction<UpdateTabStopInstancePayload>();
    public readonly removeTabStopInstance = new SyncAction<RemoveTabStopInstancePayload>();
    public readonly resetTabStopRequirementStatus =
        new SyncAction<ResetTabStopRequirementStatusPayload>();
    public readonly toggleTabStopRequirementExpand =
        new SyncAction<ToggleTabStopRequirementExpandPayload>();
    public readonly updateTabbingCompleted = new SyncAction<UpdateTabbingCompletedPayload>();
    public readonly updateNeedToCollectTabbingResults =
        new SyncAction<UpdateNeedToCollectTabbingResultsPayload>();
    public readonly automatedTabbingResultsCompleted = new SyncAction<BaseActionPayload>();
}
