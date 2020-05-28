// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanel } from 'background/stores/side-panel';
import { Action } from 'common/flux/action';

export class SidePanelActions {
    public readonly openSidePanel = new Action<SidePanel>();
    public readonly closeSidePanel = new Action<SidePanel>();
}
