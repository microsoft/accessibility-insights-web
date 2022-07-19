// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { BaseActionPayload } from './action-payloads';

export interface ScopingPayload extends BaseActionPayload {
    inputType: string;
    selector: string[];
}

export class ScopingActions {
    public readonly addSelector = new SyncAction<ScopingPayload>();
    public readonly deleteSelector = new SyncAction<ScopingPayload>();
    public readonly getCurrentState = new SyncAction<void>();
}
