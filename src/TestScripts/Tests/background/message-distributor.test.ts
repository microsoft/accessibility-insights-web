// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { ChromeAdapter } from '../../../background/browser-adapter';
import { GlobalContext } from '../../../background/global-context';
import { Interpreter } from '../../../background/interpreter';
import { ISender, MessageDistributor } from '../../../background/message-distributor';
import { TabContext, TabToContextMap } from '../../../background/tab-context';

describe('MessageDistributorTest', () => {
    let mockBrowserAdapter: IMock<ChromeAdapter>;
    let testSubject: MessageDistributor;
    let tabToInterpreterMap: TabToContextMap;
    let globalContextMock: IMock<GlobalContext>;
    let globalInterpreter: Interpreter;

    let distributeMessageCallback: (message: any, sender?: ISender) => void;

    beforeAll(() => {
        mockBrowserAdapter = Mock.ofType(ChromeAdapter);
        tabToInterpreterMap = {};
        mockBrowserAdapter.reset();

        globalContextMock = Mock.ofType(GlobalContext);
        globalContextMock.setup(x => x.interpreter).returns(() => globalInterpreter);
        testSubject = new MessageDistributor(globalContextMock.object, tabToInterpreterMap, mockBrowserAdapter.object);

        mockBrowserAdapter
            .setup(x => x.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                distributeMessageCallback = callback;
            })
            .verifiable();
    });

    test('distribute message to both global & tabcontext', () => {
        const tabId = 1;

        const globalInterpreterMock = createInterpreterMockWithInteraction();
        globalInterpreter = globalInterpreterMock.object;
        const tabContextInterpreterMock = createInterpreterMockWithInteraction();
        tabToInterpreterMap[tabId] = new TabContext(tabContextInterpreterMock.object as any, null);
        const message = { tabId: tabId, payload: {} };

        testSubject.initialize();

        distributeMessageCallback(message);

        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
    });

    test('should not distribute message, when tabid is not set', () => {
        const tabId = 1;

        const globalInterpreterMock = createInterpreterMockWithInteraction();
        globalInterpreter = globalInterpreterMock.object;
        const tabContextInterpreterMock = createInterpreterMockWithoutInteraction();
        tabToInterpreterMap[tabId] = new TabContext(tabContextInterpreterMock.object as any, null);

        testSubject.initialize();
        const message = { payload: {} };

        distributeMessageCallback(message);

        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
    });

    test('should not distribute message, when tabid is not set & sender tab is null ', () => {
        const tabId = 1;

        const globalInterpreterMock = createInterpreterMockWithInteraction();
        globalInterpreter = globalInterpreterMock.object;
        const tabContextInterpreterMock = createInterpreterMockWithoutInteraction();
        tabToInterpreterMap[tabId] = new TabContext(tabContextInterpreterMock.object as any, null);

        testSubject.initialize();
        const message = { payload: {} };
        const sender: ISender = {};

        distributeMessageCallback(message, sender);

        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
    });

    test('should distribute message, when sender has tab id', () => {
        const tabId = 1;
        const message = { payload: {} } as IMessage;

        const globalInterpreterMock = createInterpreterMockWithInteraction();
        globalInterpreter = globalInterpreterMock.object;
        const tabContextInterpreterMock = createInterpreterMockWithInteraction();
        tabToInterpreterMap[tabId] = new TabContext(tabContextInterpreterMock.object as any, null);

        testSubject.initialize();
        const sender: ISender = { tab: { id: 1 } };

        distributeMessageCallback(message, sender);

        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
        expect(message.tabId).toBe(tabId);
    });

    test('should not distribute message, when interpreter is not available', () => {
        const anotherTabId = 10;

        const globalInterpreterMock = createInterpreterMockWithInteraction();
        globalInterpreter = globalInterpreterMock.object;

        const tabContextInterpreterMock = createInterpreterMockWithoutInteraction();
        tabToInterpreterMap[1] = new TabContext(tabContextInterpreterMock.object as any, null);

        testSubject.initialize();
        const message = { tabId: anotherTabId, payload: {} };

        distributeMessageCallback(message);

        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
    });

    function createInterpreterMockWithoutInteraction(): IMock<Interpreter> {
        const interpreterMock = Mock.ofType(Interpreter);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .verifiable(Times.never());

        return interpreterMock;
    }

    function createInterpreterMockWithInteraction(): IMock<Interpreter> {
        const interpreterMock = Mock.ofType(Interpreter);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .verifiable(Times.once());

        return interpreterMock;
    }
});
