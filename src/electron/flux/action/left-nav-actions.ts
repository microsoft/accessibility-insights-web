// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavActions {
    public readonly itemSelected = new SyncAction<LeftNavItemKey>();
    public readonly setLeftNavVisible = new SyncAction<boolean>();
}
