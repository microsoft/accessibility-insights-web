// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { ChromeAdapter } from '../../../../background/browser-adapter';
import { ChromeFeatureController } from '../../../../background/chrome-feature-controller';

describe('ChromeFeatureControllerTest', () => {
    let browserAdapterMock: IMock<ChromeAdapter>;
    beforeEach(() => {
        browserAdapterMock = Mock.ofType(ChromeAdapter);
    });
    test('openCommandConfigureTab', () => {
        browserAdapterMock.setup(ba => ba.createTab('chrome://extensions/configureCommands')).verifiable();

        const testSubject = new ChromeFeatureController(browserAdapterMock.object);
        testSubject.openCommandConfigureTab();

        browserAdapterMock.verifyAll();
    });

    test('openIssueFilingWindow', () => {
        const url = 'issueUrl';
        browserAdapterMock.setup(ba => ba.createTabInNewWindow('issueUrl')).verifiable();

        const testSubject = new ChromeFeatureController(browserAdapterMock.object);
        testSubject.openIssueFilingWindow(url);

        browserAdapterMock.verifyAll();
    });
});
