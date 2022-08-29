// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { SyncAction } from 'common/flux/sync-action';

export class ScanActions {
    public readonly scanStarted = new AsyncAction<void>();
    public readonly scanCompleted = new SyncAction<void>();
    public readonly scanFailed = new SyncAction<void>();
}
