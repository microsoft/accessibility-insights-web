// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
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
    public readonly getCurrentState = new AsyncAction();
    public readonly updateTabStopsRequirementStatus =
        new AsyncAction<UpdateTabStopRequirementStatusPayload>();
    public readonly addTabStopInstance = new AsyncAction<AddTabStopInstancePayload>();
    public readonly updateTabStopInstance = new AsyncAction<UpdateTabStopInstancePayload>();
    public readonly removeTabStopInstance = new AsyncAction<RemoveTabStopInstancePayload>();
    public readonly resetTabStopRequirementStatus =
        new AsyncAction<ResetTabStopRequirementStatusPayload>();
    public readonly toggleTabStopRequirementExpand =
        new AsyncAction<ToggleTabStopRequirementExpandPayload>();
    public readonly updateTabbingCompleted = new AsyncAction<UpdateTabbingCompletedPayload>();
    public readonly updateNeedToCollectTabbingResults =
        new AsyncAction<UpdateNeedToCollectTabbingResultsPayload>();
    public readonly automatedTabbingResultsCompleted = new AsyncAction<BaseActionPayload>();
}
