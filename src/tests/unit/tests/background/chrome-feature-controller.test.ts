// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { ChromeFeatureController } from '../../../../background/chrome-feature-controller';

describe('ChromeFeatureControllerTest', () => {
    test('openCommandConfigureTab', () => {
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock.setup(ba => ba.createTab('chrome://extensions/configureCommands')).verifiable();

        const testSubject = new ChromeFeatureController(browserAdapterMock.object);
        testSubject.openCommandConfigureTab();

        browserAdapterMock.verifyAll();
    });
});
