// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DebugToolsNavActions } from 'debug-tools/actions/debug-tools-nav-actions';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';

export class DebugToolsNavActionCreator {
    constructor(private readonly debugToolsNavActions: DebugToolsNavActions) {}

    public onSelectTool = async (selectedTool: ToolsNavKey): Promise<void> => {
        await this.debugToolsNavActions.setSelectedTool.invoke(selectedTool);
    };
}
