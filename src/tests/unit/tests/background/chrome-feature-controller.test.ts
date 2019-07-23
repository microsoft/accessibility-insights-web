// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { ChromeShortcutsPageController } from '../../../../background/chrome-feature-controller';

describe('ChromeShortcutsPageController', () => {
    it('opens the shortcuts tab', () => {
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();

        const testSubject = new ChromeShortcutsPageController(browserAdapterMock.object);
        testSubject.openShortcutsTab();

        browserAdapterMock.verify(adapter => adapter.createTab('chrome://extensions/shortcuts'), Times.once());
    });
});
