// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { ShortcutsPageController } from '../../../../background/chrome-shortcuts-page-controller';

describe('ChromeShortcutsPageController', () => {
    it('opens the shortcuts tab', () => {
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();

        const testSubject = new ShortcutsPageController(browserAdapterMock.object);
        testSubject.openShortcutsTab();

        browserAdapterMock.verify(adapter => adapter.createTab('chrome://extensions/shortcuts'), Times.once());
    });
});
