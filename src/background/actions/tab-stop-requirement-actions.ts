// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import {
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
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
}
