// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { DebugToolsNavActionCreator } from 'debug-tools/action-creators/debug-tools-nav-action-creator';
import { DebugToolsNavActions } from 'debug-tools/actions/debug-tools-nav-actions';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import { Mock, Times } from 'typemoq';

describe('DebugToolsNavActionCreator', () => {
    it('onSelectTool', () => {
        const setSelectedToolMock = Mock.ofType<SyncAction<ToolsNavKey>>();

        const debugToolsNavActionsMock = Mock.ofType(DebugToolsNavActions);

        debugToolsNavActionsMock
            .setup(actions => actions.setSelectedTool)
            .returns(() => setSelectedToolMock.object);

        const testSubject = new DebugToolsNavActionCreator(debugToolsNavActionsMock.object);

        const selectedTool: ToolsNavKey = 'stores';

        testSubject.onSelectTool(selectedTool);

        setSelectedToolMock.verify(action => action.invoke(selectedTool), Times.once());
    });
});
