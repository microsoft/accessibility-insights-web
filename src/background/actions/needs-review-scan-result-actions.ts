// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { UnifiedScanCompletedPayload } from './action-payloads';

export class NeedsReviewScanResultActions {
    public readonly scanCompleted = new Action<UnifiedScanCompletedPayload>();
    public readonly getCurrentState = new Action();
}
