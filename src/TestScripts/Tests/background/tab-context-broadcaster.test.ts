// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { TabContextBroadcaster } from '../../../background/tab-context-broadcaster';
import { StoreUpdateMessage } from '../../../common/types/store-update-message';

describe('TabContextBroadcasterTest', () => {
    test('getBroadcastMessageDelegate', () => {
        const tabId = 1;
        const message = {someData: 1} as any;
        const expectedMessage = {tabId: tabId, ...message} as StoreUpdateMessage<any>;

        const mockSendMessageToFramesAndTab = Mock.ofInstance((tabId, message) => { });

        mockSendMessageToFramesAndTab
            .setup(send => send(tabId, expectedMessage))
            .verifiable();

        const testSubject = new TabContextBroadcaster(mockSendMessageToFramesAndTab.object);
        testSubject.getBroadcastMessageDelegate(1)(message);

        mockSendMessageToFramesAndTab.verifyAll();
    });
});
