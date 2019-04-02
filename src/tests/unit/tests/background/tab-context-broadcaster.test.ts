// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { TabContextBroadcaster } from '../../../../background/tab-context-broadcaster';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';

describe('TabContextBroadcasterTest', () => {
    test('getBroadcastMessageDelegate', () => {
        const testTabId = 1;
        const testMessage = { someData: 1 } as any;
        const expectedMessage = { tabId: testTabId, ...testMessage } as StoreUpdateMessage<any>;

        const mockSendMessageToFramesAndTab = Mock.ofInstance((tabId, message) => {});

        mockSendMessageToFramesAndTab.setup(send => send(testTabId, expectedMessage)).verifiable();

        const testSubject = new TabContextBroadcaster(mockSendMessageToFramesAndTab.object);
        testSubject.getBroadcastMessageDelegate(1)(testMessage);

        mockSendMessageToFramesAndTab.verifyAll();
    });
});
