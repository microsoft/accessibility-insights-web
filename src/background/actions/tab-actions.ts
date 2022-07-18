// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { Tab } from 'common/itab';

export class TabActions {
    public readonly newTabCreated = new SyncAction<Tab>();
    public readonly getCurrentState = new SyncAction();
    public readonly injectedScripts = new SyncAction();
    public readonly tabRemove = new SyncAction();
    public readonly existingTabUpdated = new SyncAction<Tab>();
    public readonly tabVisibilityChange = new SyncAction<boolean>();
}
