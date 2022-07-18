// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';

export class TabStopsActions {
    public readonly enableFocusTracking = new SyncAction<void>();
    public readonly disableFocusTracking = new SyncAction<void>();
    public readonly startOver = new SyncAction<void>();
}
