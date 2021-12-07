// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import {
    ScanCompletedPayload,
    TabStopsScanCompletedPayload,
} from '../../injected/analyzers/analyzer';
import { AddTabbedElementPayload } from './action-payloads';

export class VisualizationScanResultActions {
    public readonly scanCompleted = new Action<ScanCompletedPayload<any>>();
    public readonly tabStopsScanCompleted = new Action<TabStopsScanCompletedPayload>();
    public readonly getCurrentState = new Action();
    public readonly addTabbedElement = new Action<AddTabbedElementPayload>();
    public readonly disableTabStop = new Action();
}
