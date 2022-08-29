// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanel } from 'background/stores/side-panel';
import { AsyncAction } from 'common/flux/async-action';

export class SidePanelActions {
    public readonly openSidePanel = new AsyncAction<SidePanel>();
    public readonly closeSidePanel = new AsyncAction<SidePanel>();
}
