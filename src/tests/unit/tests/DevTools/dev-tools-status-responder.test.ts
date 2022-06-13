// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import { DevToolsStatusResponder } from 'Devtools/dev-tools-status-responder';
import { IMock, Mock } from 'typemoq';

describe(DevToolsStatusResponder, () => {
    const inspectedTabId = 10;
    let browserAdapterMock: IMock<BrowserAdapter>;

    let testSubject: DevToolsStatusResponder;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock.setup(b => b.getInspectedWindowTabId()).returns(() => inspectedTabId);

        testSubject = new DevToolsStatusResponder(browserAdapterMock.object);
    });

    it('Responds isActive: true to status request message for this tab', async () => {
        const message = {
            messageType: Messages.DevTools.StatusRequest,
            tabId: inspectedTabId,
        };
        const expectedResponse = {
            isActive: true,
        };

        await expect(testSubject.handleBrowserMessage(message)).resolves.toEqual(expectedResponse);
    });

    it('Returns void for status requests for a different tab', () => {
        const message = {
            messageType: Messages.DevTools.StatusRequest,
            tabId: inspectedTabId + 10,
        };

        const response = testSubject.handleBrowserMessage(message);

        expect(response).toBeUndefined();
    });

    it('Returns void for unknown message types', () => {
        const message = {
            messageType: 'another message type',
        };

        const response = testSubject.handleBrowserMessage(message);

        expect(response).toBeUndefined();
    });
});
