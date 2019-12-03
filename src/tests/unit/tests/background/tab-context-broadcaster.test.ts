// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { TabContextBroadcaster } from 'background/tab-context-broadcaster';
import { Logger } from 'common/logging/logger';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';

describe('TabContextBroadcaster', () => {
    describe('getBroadcastMessageDelegate', () => {
        it('produces the expected BrowserAdapter calls when invoked', async () => {
            const testTabId = 1;
            const testMessage = { someData: 1 } as any;
            const expectedMessage = { tabId: testTabId, ...testMessage } as StoreUpdateMessage<any>;

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(testTabId, expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            const testSubject = new TabContextBroadcaster(browserAdapterMock.object);

            await testSubject.getBroadcastMessageDelegate(1)(testMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates errors from sendMessageToFrames to its logger', async () => {
            const testMessage = { someData: 1 } as any;
            const expectedError = 'error from sendMessageToFrames';

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.reject(expectedError));
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.resolve());

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedError)).verifiable(Times.once());
            const testSubject = new TabContextBroadcaster(browserAdapterMock.object, loggerMock.object);

            await testSubject.getBroadcastMessageDelegate(1)(testMessage);

            loggerMock.verifyAll();
        });

        it('propagates errors from sendMessageToTab to its logger', async () => {
            const testMessage = { someData: 1 } as any;
            const expectedError = 'error from sendMessageToTab';

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.resolve());
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.reject(expectedError));

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedError)).verifiable(Times.once());
            const testSubject = new TabContextBroadcaster(browserAdapterMock.object, loggerMock.object);

            await testSubject.getBroadcastMessageDelegate(1)(testMessage);

            loggerMock.verifyAll();
        });
    });
});
