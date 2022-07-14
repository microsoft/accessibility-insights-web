// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { ScanCompletedPayload } from '../../injected/analyzers/analyzer';
import { AddTabbedElementPayload } from './action-payloads';

export class VisualizationScanResultActions {
    public readonly scanCompleted = new SyncAction<ScanCompletedPayload<any>>();
    public readonly getCurrentState = new SyncAction();
    public readonly addTabbedElement = new SyncAction<AddTabbedElementPayload>();
    public readonly disableTabStop = new SyncAction();
}
