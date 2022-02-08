// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
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
    public readonly getCurrentState = new Action();
    public readonly updateTabStopsRequirementStatus =
        new Action<UpdateTabStopRequirementStatusPayload>();
    public readonly addTabStopInstance = new Action<AddTabStopInstancePayload>();
    public readonly updateTabStopInstance = new Action<UpdateTabStopInstancePayload>();
    public readonly removeTabStopInstance = new Action<RemoveTabStopInstancePayload>();
    public readonly resetTabStopRequirementStatus =
        new Action<ResetTabStopRequirementStatusPayload>();
    public readonly toggleTabStopRequirementExpand =
        new Action<ToggleTabStopRequirementExpandPayload>();
    public readonly updateTabbingCompleted = new Action<UpdateTabbingCompletedPayload>();
    public readonly updateNeedToCollectTabbingResults =
        new Action<UpdateNeedToCollectTabbingResultsPayload>();
    public readonly automatedTabbingResultsCompleted = new Action<BaseActionPayload>();
}
