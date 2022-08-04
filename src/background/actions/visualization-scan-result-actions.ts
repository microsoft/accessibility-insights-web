// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { ScanCompletedPayload } from '../../injected/analyzers/analyzer';
import { AddTabbedElementPayload } from './action-payloads';

export class VisualizationScanResultActions {
    public readonly scanCompleted = new AsyncAction<ScanCompletedPayload<any>>();
    public readonly getCurrentState = new AsyncAction();
    public readonly addTabbedElement = new AsyncAction<AddTabbedElementPayload>();
    public readonly disableTabStop = new AsyncAction();
}
