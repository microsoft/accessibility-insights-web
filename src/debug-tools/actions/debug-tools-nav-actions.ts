// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';

export class DebugToolsNavActions {
    public readonly setSelectedTool = new SyncAction<ToolsNavKey>();
}
