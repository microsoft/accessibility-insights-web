// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { UnifiedScanCompletedPayload } from './action-payloads';

export class UnifiedScanResultActions {
    public readonly scanCompleted = new SyncAction<UnifiedScanCompletedPayload>();
    public readonly getCurrentState = new SyncAction();
}
