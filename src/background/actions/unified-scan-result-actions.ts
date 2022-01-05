// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { VisualizationType } from 'common/types/visualization-type';
import { UnifiedScanCompletedPayload } from './action-payloads';

export class UnifiedScanResultActions {
    public readonly scanCompleted = new Action<UnifiedScanCompletedPayload>();
    public readonly getCurrentState = new Action();
    public readonly resetStoreData = new Action<VisualizationType>();
}
