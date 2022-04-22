// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalContext } from 'background/global-context';
import { Interpreter } from 'background/interpreter';
import { MessageDistributor, Sender } from 'background/message-distributor';
import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { TabContext, TabToContextMap } from 'background/tab-context';
import { IMock, It, Mock, Times } from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { Logger } from '../../../../common/logging/logger';
import { InterpreterMessage } from '../../../../common/message';

describe('MessageDistributorTest', () => {
    const tabId = 1;

    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let testSubject: MessageDistributor;
    let tabToInterpreterMap: TabToContextMap;
    let globalContextMock: IMock<GlobalContext>;
    let globalInterpreterMock: IMock<Interpreter>;
    let tabContextInterpreterMock: IMock<Interpreter>;
    let postMessageContentHandlerMock: IMock<PostMessageContentHandler>;
    let loggerMock: IMock<Logger>;

    let distributeMessageCallback: (message: any, sender?: Sender) => any;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();

        globalInterpreterMock = Mock.ofType(Interpreter);
        setupInterpreterMockWithInteraction(globalInterpreterMock, false);

        tabContextInterpreterMock = Mock.ofType(Interpreter);

        tabToInterpreterMap = {};
        tabToInterpreterMap[tabId] = new TabContext(tabContextInterpreterMock.object as any, null);

        globalContextMock = Mock.ofType(GlobalContext);
        globalContextMock.setup(x => x.interpreter).returns(() => globalInterpreterMock.object);

        postMessageContentHandlerMock = Mock.ofType<PostMessageContentHandler>();

        loggerMock = Mock.ofType<Logger>();
        testSubject = new MessageDistributor(
            globalContextMock.object,
            tabToInterpreterMap,
            postMessageContentHandlerMock.object,
            mockBrowserAdapter.object,
            loggerMock.object,
        );

        mockBrowserAdapter
            .setup(adapter => adapter.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                distributeMessageCallback = callback;
            })
            .verifiable();
    });

    afterEach(() => {
        tabContextInterpreterMock.verifyAll();
        globalInterpreterMock.verifyAll();
        postMessageContentHandlerMock.verifyAll();
        loggerMock.verifyAll();
    });

    test('distribute message to both global & tabcontext', () => {
        const message = { tabId: tabId, payload: {} };

        setupInterpreterMockWithInteraction(tabContextInterpreterMock, true);
        setupBackchannelIgnoreMessage(message);
        setupNeverLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message);
    });

    test('should not distribute message, when tabid is not set', () => {
        const message = { payload: {} };

        setupInterpreterMockWithoutInteraction(tabContextInterpreterMock);
        setupBackchannelIgnoreMessage(message);
        setupLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message);
    });

    test('should not distribute message, when tabid is not set & sender tab is null ', () => {
        const message = { payload: {} };
        const sender: Sender = {};

        setupInterpreterMockWithoutInteraction(tabContextInterpreterMock);
        setupBackchannelIgnoreMessage(message);
        setupLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message, sender);
    });

    test('should distribute message, when sender has tab id', () => {
        const message = { payload: {} } as InterpreterMessage;
        const sender: Sender = { tab: { id: 1 } };

        setupInterpreterMockWithInteraction(tabContextInterpreterMock, true);
        setupBackchannelIgnoreMessage(message);
        setupNeverLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message, sender);

        expect(message.tabId).toBe(tabId);
    });

    test('should not distribute message, when interpreter is not available', () => {
        const anotherTabId = 10;
        const message = { tabId: anotherTabId, payload: {} };

        setupInterpreterMockWithoutInteraction(tabContextInterpreterMock);
        setupBackchannelIgnoreMessage(message);
        setupLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message);
    });

    test.each(['response obj', undefined])(
        'should distribute backchannel message and return %s',
        response => {
            const message = { payload: {} };

            setupInterpreterMockWithoutInteraction(tabContextInterpreterMock);
            setupInterpretBackchannelMessage(message as InterpreterMessage, response);
            setupNeverLogFailure();

            testSubject.initialize();

            const actualResponse = distributeMessageCallback(message);

            expect(actualResponse).toEqual(response);
        },
    );

    function setupInterpreterMockWithoutInteraction(interpreterMock: IMock<Interpreter>): void {
        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());
    }

    function setupInterpreterMockWithInteraction(
        interpreterMock: IMock<Interpreter>,
        success: boolean,
    ): void {
        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(() => success)
            .verifiable(Times.once());
    }

    function setupBackchannelIgnoreMessage(message: any): void {
        postMessageContentHandlerMock
            .setup(o => o.handleMessage(It.isObjectWith(message)))
            .returns(() => ({ success: false }))
            .verifiable();
    }

    function setupInterpretBackchannelMessage(message: InterpreterMessage, response?: any): void {
        postMessageContentHandlerMock
            .setup(o => o.handleMessage(It.isObjectWith(message)))
            .returns(() => ({ success: true, response }))
            .verifiable();
    }

    function setupLogFailure() {
        loggerMock
            .setup(l =>
                l.log(
                    It.is(message => (message as string).includes('Unable to interpret message')),
                    It.isAny(),
                ),
            )
            .verifiable();
    }

    function setupNeverLogFailure() {
        loggerMock.setup(l => l.log(It.isAny(), It.isAny())).verifiable(Times.never());
    }
});
