// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { IScanCompletedPayload } from '../../injected/analyzers/analyzer';
import { AddTabbedElementPayload } from './action-payloads';

export class VisualizationScanResultActions {
    public readonly scanCompleted = new Action<IScanCompletedPayload<any>>();
    public readonly getCurrentState = new Action();
    public readonly updateIssuesSelectedTargets = new Action<string[]>();
    public readonly disableIssues = new Action();
    public readonly addTabbedElement = new Action<AddTabbedElementPayload>();
    public readonly disableTabStop = new Action();
}
