// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DebugToolsNavActions } from 'debug-tools/actions/debug-tools-nav-actions';
import {
    DebugToolsNavStore,
    DebugToolsNavStoreData,
    ToolsNavKey,
} from 'debug-tools/stores/debug-tools-nav-store';
import { BaseDataBuilder } from 'tests/unit/common/base-data-builder';
import { StoreTester } from 'tests/unit/common/store-tester';

describe('DebugToolsNavStore', () => {
    describe('onSetSelectedTool', () => {
        it('handles tool already selected', async () => {
            const initialState = new DebugToolsNavStoreDataBuilder().build();

            const alreadySelectedKey = initialState.selectedTool;

            const finalState = new DebugToolsNavStoreDataBuilder().build();

            const storeTester =
                createStoreTesterForDebugToolsNavActions('setSelectedTool').withActionParam(
                    alreadySelectedKey,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, finalState);
        });

        it('handles tool selected change', async () => {
            const initialState = new DebugToolsNavStoreDataBuilder()
                .with('selectedTool', 'telemetryViewer')
                .build();

            const selectedKey: ToolsNavKey = 'stores';

            const finalState = new DebugToolsNavStoreDataBuilder()
                .with('selectedTool', selectedKey)
                .build();

            const storeTester =
                createStoreTesterForDebugToolsNavActions('setSelectedTool').withActionParam(
                    selectedKey,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        });
    });

    function createStoreTesterForDebugToolsNavActions(
        actionName: keyof DebugToolsNavActions,
    ): StoreTester<DebugToolsNavStoreData, DebugToolsNavActions> {
        const factory = (actions: DebugToolsNavActions) => new DebugToolsNavStore(actions);

        return new StoreTester(DebugToolsNavActions, actionName, factory);
    }
});

class DebugToolsNavStoreDataBuilder extends BaseDataBuilder<DebugToolsNavStoreData> {
    constructor() {
        super();
        this.data = new DebugToolsNavStore(null).getDefaultState();
    }
}
