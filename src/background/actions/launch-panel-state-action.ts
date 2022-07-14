// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';

export class LaunchPanelStateActions {
    public readonly setLaunchPanelType = new SyncAction<LaunchPanelType>();
    public readonly getCurrentState = new SyncAction();
}
