// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { TabContext } from 'background/tab-context';
import { TabContextManager } from 'background/tab-context-manager';
import { Message } from 'common/message';
import { IMock, Mock } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

describe(TabContextManager, () => {
    const tabId = 4;

    let tabToContextMap: DictionaryNumberTo<TabContext>;
    let tabContextMock: IMock<TabContext>;
    let interpreterMock: IMock<Interpreter>;

    let testSubject: TabContextManager;

    beforeEach(() => {
        tabContextMock = Mock.ofType<TabContext>();
        tabToContextMap = {};
        tabContextMock = Mock.ofType<TabContext>();
        interpreterMock = Mock.ofType<Interpreter>();

        testSubject = new TabContextManager(tabToContextMap);
    });

    afterEach(() => {
        tabContextMock.verifyAll();
        interpreterMock.verifyAll();
    });

    it('Adds new tab context to map', () => {
        testSubject.addTabContextIfNotExists(tabId, tabContextMock.object);

        expect(tabToContextMap[tabId]).toBe(tabContextMock.object);
    });

    it('Does not recreate tab context if already exists', () => {
        const existingTabContext = Mock.ofType<TabContext>();
        tabToContextMap[tabId] = existingTabContext.object;

        testSubject.addTabContextIfNotExists(tabId, tabContextMock.object);

        expect(tabToContextMap[tabId]).toBe(existingTabContext.object);
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
