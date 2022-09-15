// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { TabContextStoreHub } from 'background/stores/tab-context-store-hub';
import { TabContext } from 'background/tab-context';
import { TabContextFactory } from 'background/tab-context-factory';
import { TabContextManager } from 'background/tab-context-manager';
import { Message } from 'common/message';
import { IMock, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

describe(TabContextManager, () => {
    const tabId = 4;

    let tabToContextMap: DictionaryNumberTo<TabContext>;
    let tabContextFactoryMock: IMock<TabContextFactory>;
    let tabContextMock: IMock<TabContext>;
    let interpreterMock: IMock<Interpreter>;
    let tabContextStoresMock: IMock<TabContextStoreHub>;

    let testSubject: TabContextManager;

    beforeEach(() => {
        tabContextFactoryMock = Mock.ofType<TabContextFactory>();
        tabContextMock = Mock.ofType<TabContext>();
        tabToContextMap = {};
        tabContextMock = Mock.ofType<TabContext>();
        interpreterMock = Mock.ofType<Interpreter>();
        tabContextStoresMock = Mock.ofType<TabContextStoreHub>();

        testSubject = new TabContextManager(tabToContextMap);
    });

    afterEach(() => {
        tabContextMock.verifyAll();
        tabContextFactoryMock.verifyAll();
        interpreterMock.verifyAll();
    });

    describe('addTabContextIfNotExists', () => {
        it('Adds new tab context to map', async () => {
            const tabContextStub = {} as TabContext;
            tabContextFactoryMock
                .setup(t => t.createTabContext(tabId))
                .returns(() => tabContextStub)
                .verifiable(Times.once());
            testSubject.addTabContextIfNotExists(tabId, tabContextFactoryMock.object);

            expect(tabToContextMap[tabId]).toBe(tabContextStub);
        });

        it('Does not recreate tab context if already exists', async () => {
            tabToContextMap[tabId] = tabContextMock.object;

            tabContextFactoryMock.setup(t => t.createTabContext(tabId)).verifiable(Times.never());

            testSubject.addTabContextIfNotExists(tabId, tabContextFactoryMock.object);

            expect(tabToContextMap[tabId]).toBe(tabContextMock.object);
        });

        it('Does not overwrite tab context if tab context is undefined', async () => {
            tabToContextMap[tabId] = undefined;

            tabContextFactoryMock.setup(t => t.createTabContext(tabId)).verifiable(Times.never());

            testSubject.addTabContextIfNotExists(tabId, tabContextFactoryMock.object);

            expect(tabToContextMap[tabId]).toBeUndefined();
        });
    });

    describe('deleteTabContext', () => {
        it('Deletes tab context and calls teardown', async () => {
            tabContextMock.setup(t => t.teardown()).verifiable();

            tabToContextMap[tabId] = tabContextMock.object;

            await testSubject.deleteTabContext(tabId);

            expect(Object.keys(tabToContextMap)).not.toContain(tabId);
        });

        it('Deletes undefined tab context', async () => {
            tabToContextMap[tabId] = undefined;

            await testSubject.deleteTabContext(tabId);

            expect(Object.keys(tabToContextMap)).not.toContain(tabId);
        });

        it('Handles tab id with no context', async () => {
            await testSubject.deleteTabContext(tabId + 10);
        });
    });

    describe('interpretMessageForTab', () => {
        it.each([true, false])(
            'Interpret message with TabContext interpreter and return result=%s',
            isInterpreted => {
                const message: Message = { messageType: 'test message' };
                tabToContextMap[tabId] = tabContextMock.object;
                const expectedReturnValue = { messageHandled: isInterpreted, result: undefined };

                tabContextMock.setup(t => t.interpreter).returns(() => interpreterMock.object);
                interpreterMock.setup(i => i.interpret(message)).returns(() => expectedReturnValue);

                const actualReturnValue = testSubject.interpretMessageForTab(tabId, message);

                expect(actualReturnValue).toEqual(expectedReturnValue);
            },
        );

        it('Handles interpretMessageForTab on tab id without context', () => {
            const message: Message = { messageType: 'test message' };

            const interpreted = testSubject.interpretMessageForTab(tabId, message);

            expect(interpreted).toEqual({ messageHandled: false });
        });
    });

    describe('getTabContextStores', () => {
        it('Returns storeHub of tab in map', () => {
            tabToContextMap[tabId] = tabContextMock.object;

            tabContextMock.setup(t => t.stores).returns(() => tabContextStoresMock.object);

            const stores = testSubject.getTabContextStores(tabId);

            expect(stores).toBe(tabContextStoresMock.object);
        });

        it('Returns undefined if tab is not in map', () => {
            const stores = testSubject.getTabContextStores(tabId);

            expect(stores).toBeUndefined();
        });
    });
});
