// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior, Times } from 'typemoq';

import { TabContextBroadcaster } from 'background/tab-context-broadcaster';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';

describe('TabContextBroadcasterTest', () => {
    test('getBroadcastMessageDelegate', () => {
        const testTabId = 1;
        const testMessage = { someData: 1 } as any;
        const expectedMessage = { tabId: testTabId, ...testMessage } as StoreUpdateMessage<any>;

        const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
        browserAdapterMock.setup(ba => ba.sendMessageToFrames(expectedMessage)).verifiable(Times.once());
        browserAdapterMock.setup(ba => ba.sendMessageToTab(testTabId, expectedMessage)).verifiable(Times.once());

        const testSubject = new TabContextBroadcaster(browserAdapterMock.object);

        testSubject.getBroadcastMessageDelegate(1)(testMessage);

        browserAdapterMock.verifyAll();
    });
});
