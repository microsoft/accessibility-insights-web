// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { TargetAppInfoPayload, UnifiedScanCompletedPayload } from './action-payloads';

export class UnifiedScanResultActions {
    public readonly scanCompleted = new Action<UnifiedScanCompletedPayload>();
    public readonly updateTargetAppInfo = new Action<TargetAppInfoPayload>();
    public readonly getCurrentState = new Action();
}
