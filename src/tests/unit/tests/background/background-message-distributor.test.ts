// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundMessageDistributor, Sender } from 'background/background-message-distributor';
import { GlobalContext } from 'background/global-context';
import { Interpreter } from 'background/interpreter';
import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { TabContextManager } from 'background/tab-context-manager';
import { IMock, It, Mock, Times } from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { Logger } from '../../../../common/logging/logger';
import { InterpreterMessage } from '../../../../common/message';

describe(BackgroundMessageDistributor, () => {
    const tabId = 1;

    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let tabContextManagerMock: IMock<TabContextManager>;
    let globalContextMock: IMock<GlobalContext>;
    let globalInterpreterMock: IMock<Interpreter>;
    let postMessageContentHandlerMock: IMock<PostMessageContentHandler>;
    let loggerMock: IMock<Logger>;

    let testSubject: BackgroundMessageDistributor;

    let distributeMessageCallback: (message: any, sender?: Sender) => any;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();

        globalInterpreterMock = Mock.ofType(Interpreter);
        setupGlobalInterpreterInteraction(false);

        tabContextManagerMock = Mock.ofType(TabContextManager);

        globalContextMock = Mock.ofType(GlobalContext);
        globalContextMock.setup(x => x.interpreter).returns(() => globalInterpreterMock.object);

        postMessageContentHandlerMock = Mock.ofType<PostMessageContentHandler>();

        loggerMock = Mock.ofType<Logger>();
        testSubject = new BackgroundMessageDistributor(
            globalContextMock.object,
            tabContextManagerMock.object,
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
        tabContextManagerMock.verifyAll();
        globalInterpreterMock.verifyAll();
        postMessageContentHandlerMock.verifyAll();
        loggerMock.verifyAll();
    });

    test('distribute message to both global & tabcontext', () => {
        const message = { tabId: tabId, payload: {} };

        setupTabInterpreterInteraction(true);
        setupBackchannelIgnoreMessage(message);
        setupNeverLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message);
    });

    test('should not distribute message, when tabid is not set', () => {
        const message = { payload: {} };

        setupTabInterpreterWithoutInteraction();
        setupBackchannelIgnoreMessage(message);
        setupLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message);
    });

    test('should not distribute message, when tabid is not set & sender tab is null ', () => {
        const message = { payload: {} };
        const sender: Sender = {};

        setupTabInterpreterWithoutInteraction();
        setupBackchannelIgnoreMessage(message);
        setupLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message, sender);
    });

    test('should distribute message, when sender has tab id', () => {
        const message = { payload: {} } as InterpreterMessage;
        const sender: Sender = { tab: { id: 1 } };

        setupTabInterpreterInteraction(true);
        setupBackchannelIgnoreMessage(message);
        setupNeverLogFailure();

        testSubject.initialize();

        distributeMessageCallback(message, sender);

        expect(message.tabId).toBe(tabId);
    });

    describe('should distribute backchannel message', () => {
        const message = { payload: {} };

        beforeEach(() => {
            setupTabInterpreterWithoutInteraction();
            setupNeverLogFailure();
            testSubject.initialize();
        });

        test('and return undefined if there is no response object', () => {
            setupInterpretBackchannelMessage(message as InterpreterMessage);

            const actualResponse = distributeMessageCallback(message);

            expect(actualResponse).toBeUndefined();
        });

        test('and returns received non-promise response wrapped in a promise', async () => {
            const response = 'response obj';
            setupInterpretBackchannelMessage(message as InterpreterMessage, response);

            const actualResponse = distributeMessageCallback(message);

            expect(actualResponse).toBeInstanceOf(Promise);
            expect(await actualResponse).toBe(response);
        });

        test('and returns received promise response', async () => {
            const response = 'response obj';
            setupInterpretBackchannelMessage(
                message as InterpreterMessage,
                Promise.resolve(response),
            );

            const actualResponse = distributeMessageCallback(message);

            expect(actualResponse).toBeInstanceOf(Promise);
            expect(await actualResponse).toBe(response);
        });
    });

    function setupTabInterpreterWithoutInteraction(): void {
        tabContextManagerMock
            .setup(m => m.interpretMessageForTab(It.isAny(), It.isAny()))
            .verifiable(Times.never());
    }

    function setupGlobalInterpreterInteraction(success: boolean): void {
        globalInterpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(() => ({
                messageHandled: success,
                result: success ? Promise.resolve() : undefined,
            }))
            .verifiable(Times.once());
    }

    function setupTabInterpreterInteraction(success: boolean): void {
        tabContextManagerMock
            .setup(m => m.interpretMessageForTab(tabId, It.isAny()))
            .returns(() => ({
                messageHandled: success,
                result: success ? Promise.resolve() : undefined,
            }))
            .verifiable(Times.once());
    }

    function setupBackchannelIgnoreMessage(message: any): void {
        postMessageContentHandlerMock
            .setup(o => o.handleMessage(It.isObjectWith(message)))
            .returns(() => ({ messageHandled: false }))
            .verifiable();
    }

    function setupInterpretBackchannelMessage(message: InterpreterMessage, response?: any): void {
        postMessageContentHandlerMock
            .setup(o => o.handleMessage(It.isObjectWith(message)))
            .returns(() => ({ messageHandled: true, response }))
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
