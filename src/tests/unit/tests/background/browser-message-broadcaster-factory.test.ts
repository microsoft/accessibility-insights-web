// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BrowserMessageBroadcasterFactory,
    connectionErrorMessage,
} from 'background/browser-message-broadcaster-factory';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Tabs } from 'webextension-polyfill';

describe('BrowserMessageBroadcasterFactory', () => {
    let loggerMock: IMock<Logger>;
    let browserAdapterMock: IMock<BrowserAdapter>;

    let testSubject: BrowserMessageBroadcasterFactory;

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();
        browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);

        testSubject = new BrowserMessageBroadcasterFactory(
            browserAdapterMock.object,
            loggerMock.object,
        );
    });

    describe('allTabsBroadcaster', () => {
        it('produces the expected BrowserAdapter calls when invoked', async () => {
            const testTabId = 1;
            const testMessage = { someData: 'test data' } as any;
            const expectedMessage = testMessage;

            browserAdapterMock
                .setup(ba => ba.tabsQuery({}))
                .returns(() => Promise.resolve([{ id: testTabId } as Tabs.Tab]))
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(testTabId, expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.allTabsBroadcaster(testMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates errors from sendMessageToFrames to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                'sendMessageToFrames failed for message {"someData":"test data"} with browser error message: test error';

            browserAdapterMock
                .setup(ba => ba.tabsQuery({}))
                .returns(() => Promise.resolve([{ id: 1 } as Tabs.Tab]));
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(It.isAny()))
                .returns(() => Promise.reject(testError));
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny()))
                .returns(() => Promise.resolve());

            loggerMock.setup(m => m.error(expectedMessage, It.isAny())).verifiable(Times.once());

            await testSubject.allTabsBroadcaster(testMessage);

            loggerMock.verifyAll();
        });

        it('propagates errors from sendMessageToTab to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                'sendMessageToTab(1) failed for message {"someData":"test data"} with browser error message: test error';

            browserAdapterMock
                .setup(ba => ba.tabsQuery({}))
                .returns(() => Promise.resolve([{ id: 1 } as Tabs.Tab]));
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(It.isAny()))
                .returns(() => Promise.resolve());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(testError));

            loggerMock.setup(m => m.error(expectedMessage, It.isAny())).verifiable(Times.once());

            await testSubject.allTabsBroadcaster(testMessage);

            loggerMock.verifyAll();
        });

        it('does not propagate know error message', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: connectionErrorMessage };

            browserAdapterMock
                .setup(ba => ba.tabsQuery({}))
                .returns(() => Promise.resolve([{ id: 1 } as Tabs.Tab]));
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(It.isAny()))
                .returns(() => Promise.resolve());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(testError));

            loggerMock.setup(m => m.error(It.isAny(), It.isAny())).verifiable(Times.never());

            await testSubject.allTabsBroadcaster(testMessage);

            loggerMock.verifyAll();
        });
    });

    describe('createTabSpecificBroadcaster', () => {
        it('produces the expected BrowserAdapter calls when invoked', async () => {
            const testTabId = 1;
            const testMessage = { someData: 'test data' } as any;
            const expectedMessage = { tabId: testTabId, ...testMessage };

            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(testTabId, expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates errors from sendMessageToFrames to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                'sendMessageToFrames failed for message {"someData":"test data","tabId":1} with browser error message: test error';

            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(It.isAny()))
                .returns(() => Promise.reject(testError));
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny()))
                .returns(() => Promise.resolve());

            loggerMock.setup(m => m.error(expectedMessage, It.isAny())).verifiable(Times.once());

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            loggerMock.verifyAll();
        });

        it('propagates errors from sendMessageToTab to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                'sendMessageToTab(1) failed for message {"someData":"test data","tabId":1} with browser error message: test error';

            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(It.isAny()))
                .returns(() => Promise.resolve());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(testError));

            loggerMock.setup(m => m.error(expectedMessage, It.isAny())).verifiable(Times.once());

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            loggerMock.verifyAll();
        });
    });
});
