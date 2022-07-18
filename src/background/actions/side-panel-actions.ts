// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanel } from 'background/stores/side-panel';
import { SyncAction } from 'common/flux/sync-action';

export class SidePanelActions {
    public readonly openSidePanel = new SyncAction<SidePanel>();
    public readonly closeSidePanel = new SyncAction<SidePanel>();
}
