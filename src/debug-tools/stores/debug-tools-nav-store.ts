// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { DebugToolsNavActions } from 'debug-tools/actions/debug-tools-nav-actions';

export type ToolsNavKey = 'stores' | 'telemetryViewer';

export type DebugToolsNavStoreData = {
    selectedTool: ToolsNavKey;
};

export class DebugToolsNavStore extends BaseStoreImpl<DebugToolsNavStoreData> {
    constructor(private readonly toolsNavActions: DebugToolsNavActions) {
        super(StoreNames.DebugToolsNavStore);
    }

    public getDefaultState(): DebugToolsNavStoreData {
        return {
            selectedTool: 'stores',
        };
    }

    protected addActionListeners(): void {
        this.toolsNavActions.setSelectedTool.addListener(this.onSetSelectedTool);
    }
    private onSetSelectedTool = async (selectedTool: ToolsNavKey): Promise<void> => {
        if (this.state.selectedTool === selectedTool) {
            return;
        }

        this.state.selectedTool = selectedTool;
        this.emitChanged();
    };
}
