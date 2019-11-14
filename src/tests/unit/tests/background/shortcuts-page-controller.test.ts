// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { ShortcutsPageController } from 'background/shortcuts-page-controller';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';

describe('ShortcutsPageController', () => {
    it('opens the shortcuts tab', () => {
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();

        const testSubject = new ShortcutsPageController(
            browserAdapterMock.object,
        );
        testSubject.openShortcutsTab();

        browserAdapterMock.verify(
            adapter => adapter.createTab('chrome://extensions/shortcuts'),
            Times.once(),
        );
    });
});
