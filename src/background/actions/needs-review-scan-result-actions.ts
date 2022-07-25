// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { UnifiedScanCompletedPayload } from './action-payloads';

export class NeedsReviewScanResultActions {
    public readonly scanCompleted = new AsyncAction<UnifiedScanCompletedPayload>();
    public readonly getCurrentState = new AsyncAction();
}
