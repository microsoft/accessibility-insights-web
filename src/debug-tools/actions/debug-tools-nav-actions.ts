// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';

export class DebugToolsNavActions {
    public readonly setSelectedTool = new Action<ToolsNavKey>();
}
