// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { DevToolsStatusResponse } from 'common/types/dev-tools-messages';
import { DevToolsMessageDistributor } from 'Devtools/dev-tool-message-distributor';
import { IMock, It, Mock, Times } from 'typemoq';

describe(DevToolsMessageDistributor, () => {
    const inspectedTabId = 10;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let distributeMessage: (message: Message) => void | Promise<DevToolsStatusResponse>;

    let testSubject: DevToolsMessageDistributor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(b => b.addListenerOnMessage(It.isAny()))
            .callback(listener => (distributeMessage = listener))
            .verifiable(Times.once());
        browserAdapterMock.setup(b => b.getInspectedWindowTabId()).returns(() => inspectedTabId);

        testSubject = new DevToolsMessageDistributor(browserAdapterMock.object);
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
    });

    it('initialize registers message listener', () => {
        testSubject.initialize();
    });

    describe('initialized', () => {
        beforeEach(() => {
            testSubject.initialize();
        });

        it('Sends a status response to status request message for this tab', async () => {
            const message = {
                messageType: Messages.DevTools.StatusRequest,
                tabId: inspectedTabId,
            };
            const expectedResponse = {
                isActive: true,
            };

            const responsePromise = distributeMessage(message);

            expect(responsePromise).toBeInstanceOf(Promise);

            const response = await responsePromise;

            expect(response).toEqual(expectedResponse);
        });

        it('Does not send response to status request for a different tab', () => {
            const message = {
                messageType: Messages.DevTools.StatusRequest,
                tabId: inspectedTabId + 10,
            };

            const response = distributeMessage(message);

            expect(response).toBeUndefined();
        });
    });
});
