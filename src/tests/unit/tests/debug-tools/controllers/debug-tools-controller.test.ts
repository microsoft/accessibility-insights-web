// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { DebugToolsController, debugToolUrl } from 'debug-tools/controllers/debug-tools-controller';
import { Mock, Times } from 'typemoq';

describe('DebugToolsController', () => {
    it('show debug tools', async () => {
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();

        const testSubject = new DebugToolsController(browserAdapterMock.object);

        await testSubject.showDebugTools();

        browserAdapterMock.verify(
            adapter => adapter.createTabInNewWindow(debugToolUrl),
            Times.once(),
        );
    });
});
