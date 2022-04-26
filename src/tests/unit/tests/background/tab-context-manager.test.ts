// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BrowserMessageBroadcasterFactory,
    MessageBroadcaster,
} from 'background/browser-message-broadcaster-factory';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { Interpreter } from 'background/interpreter';
import { TabContext } from 'background/tab-context';
import { TabContextFactory } from 'background/tab-context-factory';
import { TabContextManager } from 'background/tab-context-manager';
import { Message } from 'common/message';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';

describe(TabContextManager, () => {
    const tabId = 4;
    const persistStoreData = false;

    let mockBroadcasterFactoryMock: IMock<BrowserMessageBroadcasterFactory>;
    let mockTabContextFactory: IMock<TabContextFactory>;
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let mockDetailsViewController: IMock<ExtensionDetailsViewController>;
    let tabToContextMap: DictionaryNumberTo<TabContext>;
    let tabContextMock: IMock<TabContext>;
    let interpreterMock: IMock<Interpreter>;

    let testSubject: TabContextManager;

    beforeEach(() => {
        mockBroadcasterFactoryMock = Mock.ofType<BrowserMessageBroadcasterFactory>();
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        mockDetailsViewController = Mock.ofType<ExtensionDetailsViewController>();
        tabToContextMap = {};
        mockTabContextFactory = Mock.ofType<TabContextFactory>();
        tabContextMock = Mock.ofType<TabContext>();
        interpreterMock = Mock.ofType<Interpreter>();

        testSubject = new TabContextManager(
            tabToContextMap,
            mockBroadcasterFactoryMock.object,
            mockBrowserAdapter.object,
            mockDetailsViewController.object,
            mockTabContextFactory.object,
            persistStoreData,
        );
    });

    afterEach(() => {
        mockBroadcasterFactoryMock.verifyAll();
        mockTabContextFactory.verifyAll();
        tabContextMock.verifyAll();
        interpreterMock.verifyAll();
    });

    it('Creates new tab context', () => {
        const broadcasterMock = Mock.ofType<MessageBroadcaster>();
        mockBroadcasterFactoryMock
            .setup(m => m.createTabSpecificBroadcaster(tabId))
            .returns(() => broadcasterMock.object)
            .verifiable();
        mockTabContextFactory
            .setup(m =>
                m.createTabContext(
                    broadcasterMock.object,
                    mockBrowserAdapter.object,
                    mockDetailsViewController.object,
                    tabId,
                    persistStoreData,
                ),
            )
            .returns(() => tabContextMock.object)
            .verifiable();

        testSubject.addTabContextIfNotExists(tabId);

        expect(tabToContextMap[tabId]).toBe(tabContextMock.object);
    });

    it('Does not recreate tab context if already exists', () => {
        tabToContextMap[tabId] = tabContextMock.object;

        mockTabContextFactory
            .setup(m =>
                m.createTabContext(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
            )
            .verifiable(Times.never());

        testSubject.addTabContextIfNotExists(tabId);
    });

    it('Deletes tab context and calls teardown', async () => {
        tabContextMock.setup(t => t.teardown()).verifiable();

        tabToContextMap[tabId] = tabContextMock.object;

        await testSubject.deleteTabContext(tabId);

        expect(tabToContextMap[tabId]).toBeUndefined();
    });

    it('Handles deleteTabContext on tab id with no context', async () => {
        await testSubject.deleteTabContext(tabId + 10);
    });

    it('Interpret message with TabContext interpreter', () => {
        const message: Message = { messageType: 'test message' };
        tabToContextMap[tabId] = tabContextMock.object;

        tabContextMock.setup(t => t.interpreter).returns(() => interpreterMock.object);
        interpreterMock.setup(i => i.interpret(message)).verifiable();

        testSubject.interpretMessageForTab(tabId, message);
    });

    it('Handles interpretMessageForTab on tab id without context', () => {
        const message: Message = { messageType: 'test message' };
        testSubject.interpretMessageForTab(tabId, message);
    });
});
