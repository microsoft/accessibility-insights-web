// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { BrowserMessageBroadcasterFactory } from 'background/browser-message-broadcaster-factory';
import { Logger } from 'common/logging/logger';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';

describe('BrowserMessageBroadcasterFactory', () => {
    describe('allTabsBroadcaster', () => {
        it('produces the expected BrowserAdapter calls when invoked', async () => {
            const testTabId = 1;
            const testMessage = { someData: 'test data' } as any;
            const expectedMessage = testMessage;

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock
                .setup(ba => ba.tabsQuery({}, It.is(isFunction)))
                .callback((_, cb) => cb([{ id: testTabId }]))
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(testTabId, expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object);

            await testSubject.allTabsBroadcaster(testMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates errors from sendMessageToFrames to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                "sendMessageToFrames failed for message { someData: 'test data' } with browser error message: test error";

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.tabsQuery({}, It.is(isFunction))).callback((_, cb) => cb([{ id: 1 }]));
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.reject(testError));
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.resolve());

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedMessage)).verifiable(Times.once());
            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object, loggerMock.object);

            await testSubject.allTabsBroadcaster(testMessage);

            loggerMock.verifyAll();
        });

        it('propagates errors from sendMessageToTab to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                "sendMessageToTab(1) failed for message { someData: 'test data' } with browser error message: test error";

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.tabsQuery({}, It.is(isFunction))).callback((_, cb) => cb([{ id: 1 }]));
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.resolve());
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.reject(testError));

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedMessage)).verifiable(Times.once());
            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object, loggerMock.object);

            await testSubject.allTabsBroadcaster(testMessage);

            loggerMock.verifyAll();
        });
    });

    describe('createTabSpecificBroadcaster', () => {
        it('produces the expected BrowserAdapter calls when invoked', async () => {
            const testTabId = 1;
            const testMessage = { someData: 'test data' } as any;
            const expectedMessage = { tabId: testTabId, ...testMessage };

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock
                .setup(ba => ba.sendMessageToFrames(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            browserAdapterMock
                .setup(ba => ba.sendMessageToTab(testTabId, expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object);

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            browserAdapterMock.verifyAll();
        });

        it('propagates errors from sendMessageToFrames to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                "sendMessageToFrames failed for message { someData: 'test data', tabId: 1 } with browser error message: test error";

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.reject(testError));
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.resolve());

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedMessage)).verifiable(Times.once());
            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object, loggerMock.object);

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            loggerMock.verifyAll();
        });

        it('propagates errors from sendMessageToTab to its logger', async () => {
            const testMessage = { someData: 'test data' } as any;
            const testError = { message: 'test error' };
            const expectedMessage =
                "sendMessageToTab(1) failed for message { someData: 'test data', tabId: 1 } with browser error message: test error";

            const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
            browserAdapterMock.setup(ba => ba.sendMessageToFrames(It.isAny())).returns(() => Promise.resolve());
            browserAdapterMock.setup(ba => ba.sendMessageToTab(It.isAny(), It.isAny())).returns(() => Promise.reject(testError));

            const loggerMock = Mock.ofType<Logger>();
            loggerMock.setup(m => m.error(expectedMessage)).verifiable(Times.once());
            const testSubject = new BrowserMessageBroadcasterFactory(browserAdapterMock.object, loggerMock.object);

            await testSubject.createTabSpecificBroadcaster(1)(testMessage);

            loggerMock.verifyAll();
        });
    });
});
