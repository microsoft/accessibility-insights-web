// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundMessageDistributor, Sender } from 'background/background-message-distributor';
import { GlobalContext } from 'background/global-context';
import { Interpreter } from 'background/interpreter';
import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { TabContextManager } from 'background/tab-context-manager';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
import { EventResponseFactory } from 'common/browser-adapters/event-response-factory';
import { InterpreterMessage, InterpreterResponse, Message } from 'common/message';
import { IMock, It, Mock, Times } from 'typemoq';

describe(BackgroundMessageDistributor, () => {
    const tabId = 1;

    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let tabContextManagerMock: IMock<TabContextManager>;
    let globalContextMock: IMock<GlobalContext>;
    let globalInterpreterMock: IMock<Interpreter>;
    let postMessageContentHandlerMock: IMock<PostMessageContentHandler>;
    let eventResponseFactoryMock: IMock<EventResponseFactory>;

    let testSubject: BackgroundMessageDistributor;

    let distributeMessageCallback: (message: any, sender?: Sender) => BrowserMessageResponse;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();

        globalInterpreterMock = Mock.ofType(Interpreter);
        tabContextManagerMock = Mock.ofType(TabContextManager);

        globalContextMock = Mock.ofType(GlobalContext);
        globalContextMock.setup(x => x.interpreter).returns(() => globalInterpreterMock.object);

        postMessageContentHandlerMock = Mock.ofType<PostMessageContentHandler>();

        eventResponseFactoryMock = Mock.ofType<EventResponseFactory>();
        testSubject = new BackgroundMessageDistributor(
            globalContextMock.object,
            tabContextManagerMock.object,
            postMessageContentHandlerMock.object,
            mockBrowserAdapter.object,
            eventResponseFactoryMock.object,
        );

        mockBrowserAdapter
            .setup(adapter => adapter.addListenerOnRuntimeMessage(It.isAny()))
            .callback(callback => {
                distributeMessageCallback = callback;
            })
            .verifiable();
    });

    afterEach(() => {
        tabContextManagerMock.verifyAll();
        globalInterpreterMock.verifyAll();
        postMessageContentHandlerMock.verifyAll();
        eventResponseFactoryMock.verifyAll();
    });

    describe('with interpreter-bound messages', () => {
        const tabBoundMessage: InterpreterMessage = {
            tabId: tabId,
            messageType: 'type',
            payload: {},
        };
        const globalOnlyMessage: Message = {
            messageType: 'type',
            payload: {},
        };

        let globalInterpreterResponse: InterpreterResponse;
        let tabInterpreterResponse: InterpreterResponse;
        const notHandledResponse: InterpreterResponse = { messageHandled: false };

        beforeEach(() => {
            setupBackchannelToIgnoreMessages();
            testSubject.initialize();
        });

        describe('for a specific tab', () => {
            let mergedResponse: InterpreterResponse;

            beforeEach(() => {
                globalInterpreterResponse = {
                    messageHandled: true,
                    result: Promise.resolve(),
                } as InterpreterResponse;
                globalInterpreterMock
                    .setup(m => m.interpret(tabBoundMessage))
                    .returns(() => globalInterpreterResponse)
                    .verifiable(Times.once());

                tabInterpreterResponse = {
                    messageHandled: true,
                    result: Promise.resolve(),
                } as InterpreterResponse;
                tabContextManagerMock
                    .setup(m => m.interpretMessageForTab(tabId, tabBoundMessage))
                    .returns(() => tabInterpreterResponse)
                    .verifiable(Times.once());

                mergedResponse = {
                    messageHandled: true,
                    result: Promise.resolve(),
                };

                eventResponseFactoryMock
                    .setup(m =>
                        m.mergeBrowserMessageResponses([
                            globalInterpreterResponse,
                            tabInterpreterResponse,
                        ]),
                    )
                    .returns(() => mergedResponse)
                    .verifiable(Times.once());
            });

            it('merges interpreter responses when tabId is embedded in message', () => {
                const response = distributeMessageCallback(tabBoundMessage);

                expect(response).toBe(mergedResponse);
            });

            it('merges interpreter responses when tabId is inferred from sender', () => {
                const sender = { tab: { id: tabId } };
                const response = distributeMessageCallback(globalOnlyMessage, sender);

                expect(response).toBe(mergedResponse);
            });
        });

        it('delegates globally-bound message merging to eventResponseHandler', () => {
            globalInterpreterResponse = {
                messageHandled: true,
                result: Promise.resolve(),
            } as InterpreterResponse;
            globalInterpreterMock
                .setup(m => m.interpret(globalOnlyMessage))
                .returns(() => globalInterpreterResponse)
                .verifiable(Times.once());

            // Shouldn't send messages without tab id to tab context
            tabContextManagerMock
                .setup(m => m.interpretMessageForTab(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            const mergedResponse: InterpreterResponse = {
                messageHandled: true,
                result: Promise.resolve(),
            };

            eventResponseFactoryMock
                .setup(m => m.mergeBrowserMessageResponses(It.isAny()))
                .callback(input => {
                    expect(input).toEqual([globalInterpreterResponse, notHandledResponse]);
                })
                .returns(() => mergedResponse)
                .verifiable(Times.once());

            const response = distributeMessageCallback(globalOnlyMessage);

            expect(response).toBe(mergedResponse);
        });
    });

    describe('with backchannel window messages', () => {
        const message = { payload: {} };

        beforeEach(() => {
            setupInterpretersToIgnoreMessages();
            testSubject.initialize();
        });

        it('should return received promise response', async () => {
            const backchannelResult = Promise.resolve('from backchannel');
            setupBackchannelToHandleMessage(message as InterpreterMessage, backchannelResult);

            const response = distributeMessageCallback(message);

            expect(response.messageHandled).toBe(true);
            expect(response.result).toBe(backchannelResult);
        });
    });

    describe('with unrecognized messages', () => {
        beforeEach(() => {
            setupInterpretersToIgnoreMessages();
            setupBackchannelToIgnoreMessages();
        });

        it('should emit a rejected promise describing the unrecognized message', async () => {
            const message = { payload: 'test-payload' };

            testSubject.initialize();

            const response = distributeMessageCallback(message);

            expect(response.messageHandled).toBe(true);
            await expect(response.result).rejects.toThrowErrorMatchingSnapshot();
        });
    });

    function setupInterpretersToIgnoreMessages(): void {
        tabContextManagerMock
            .setup(m => m.interpretMessageForTab(It.isValue(tabId), It.isAny()))
            .returns(() => ({ messageHandled: false }))
            .verifiable(Times.atMostOnce());

        globalInterpreterMock
            .setup(m => m.interpret(It.isAny()))
            .returns(() => ({ messageHandled: false }))
            .verifiable(Times.atMostOnce());

        eventResponseFactoryMock
            .setup(m => m.mergeBrowserMessageResponses(It.isAny()))
            .returns(() => ({ messageHandled: false }))
            .verifiable(Times.atMostOnce());
    }

    function setupBackchannelToIgnoreMessages(): void {
        postMessageContentHandlerMock
            .setup(o => o.handleBrowserMessage(It.isAny()))
            .returns(() => ({ messageHandled: false }))
            .verifiable(Times.atMostOnce());
    }

    function setupBackchannelToHandleMessage(
        message: InterpreterMessage,
        result: void | Promise<any>,
    ): void {
        postMessageContentHandlerMock
            .setup(o => o.handleBrowserMessage(It.isObjectWith(message)))
            .returns(() => ({ messageHandled: true, result }))
            .verifiable();
    }
});
