// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ScanCompletedPayload } from '../../injected/analyzers/analyzer';
import {
    AddTabbedElementPayload,
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from './action-payloads';

export class VisualizationScanResultActions {
    public readonly scanCompleted = new Action<ScanCompletedPayload<any>>();
    public readonly getCurrentState = new Action();
    public readonly disableIssues = new Action();
    public readonly addTabbedElement = new Action<AddTabbedElementPayload>();
    public readonly disableTabStop = new Action();
    public readonly updateTabStopsRequirementStatus = new Action<
        UpdateTabStopRequirementStatusPayload
    >();
    public readonly addTabStopInstance = new Action<AddTabStopInstancePayload>();
    public readonly updateTabStopInstance = new Action<UpdateTabStopInstancePayload>();
    public readonly removeTabStopInstance = new Action<RemoveTabStopInstancePayload>();
}
