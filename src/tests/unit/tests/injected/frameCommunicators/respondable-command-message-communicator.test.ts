// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import {
    CallbackWindowCommandMessageListener,
    CommandMessage,
    CommandMessageResponse,
    CommandMessageResponseCallback,
    RespondableCommandMessageCommunicator,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { LinkedWindowMessagePoster } from 'tests/unit/common/linked-window-message-poster';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import {
    createSimulatedWindowMessagePoster,
    SimulatedWindowMessagePoster,
} from 'tests/unit/common/simulated-window';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('RespondableCommandMessageCommunicator', () => {
    let testSubject: RespondableCommandMessageCommunicator;
    let mockBackchannelWindowMessagePoster: SimulatedWindowMessagePoster;
    let mockPromiseFactory: IMock<PromiseFactory>;
    const uniqueId = 'unique_id';

    beforeEach(() => {
        mockBackchannelWindowMessagePoster = createSimulatedWindowMessagePoster();
        mockPromiseFactory = Mock.ofType<PromiseFactory>();
        testSubject = new RespondableCommandMessageCommunicator(
            mockBackchannelWindowMessagePoster.object,
            () => {
                return uniqueId;
            },
            mockPromiseFactory.object,
            failTestOnErrorLogger,
        );
    });

    describe('promise message behavior', () => {
        test('addPromiseCommandMessageListener does not register listener if one already exists for that command', () => {
            testSubject.initialize();

            const listener1 = jest.fn();
            const listener2 = jest.fn();
            expect(() =>
                testSubject.addPromiseCommandMessageListener('command1', listener1),
            ).not.toThrow();
            expect(() =>
                testSubject.addPromiseCommandMessageListener('command1', listener2),
            ).toThrowError(`Cannot register two listeners for the same command (command1)`);
        });

        test('onWindowMessage parses message request and sends response to registered listener', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;
            const inputRequest = {
                type: 'CommandMessageRequest',
                commandMessageId: 'request-id',
                command: 'command1',
                payload: 'request payload',
            };
            const expectedResponse = {
                type: 'CommandMessageResponse',
                requestCommandMessageId: 'request-id',
                payload: 'response payload',
            };

            const listener1 = jest.fn(async (receivedMessage, sourceWindow) => {
                expect(receivedMessage.payload).toBe(inputRequest.payload);
                return { payload: expectedResponse.payload };
            });
            const listener2 = jest.fn(async (receivedMessage, sourceWindow) => {
                fail("shouldn't be called");
            });

            testSubject.addPromiseCommandMessageListener('command1', listener1);
            testSubject.addPromiseCommandMessageListener('command2', listener2);

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, expectedResponse))
                .verifiable(Times.once());

            // trigger message
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                inputRequest,
                targetWindow,
            );

            expect(listener1).toHaveBeenCalledTimes(1);
            expect(listener2).not.toHaveBeenCalled();
            mockBackchannelWindowMessagePoster.verifyAll();
        });

        test('onWindowMessage parses message request and sends back an empty response if there is no registered listener', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;
            const inputRequest = {
                type: 'CommandMessageRequest',
                commandMessageId: 'request-id',
                command: 'command1',
                payload: 'request payload',
            };
            const expectedResponse = {
                type: 'CommandMessageResponse',
                requestCommandMessageId: 'request-id',
                payload: null,
            };

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, expectedResponse))
                .verifiable(Times.once());

            // trigger message
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                inputRequest,
                targetWindow,
            );

            mockBackchannelWindowMessagePoster.verifyAll();
        });

        test('onWindowMessage parses message request and sends back an empty response if listener is removed', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;
            const inputRequest = {
                type: 'CommandMessageRequest',
                commandMessageId: 'request-id',
                command: 'command1',
                payload: 'request payload',
            };
            const expectedResponse = {
                type: 'CommandMessageResponse',
                requestCommandMessageId: 'request-id',
                payload: null,
            };

            const listener1 = jest.fn(async () => null);
            testSubject.addPromiseCommandMessageListener('command1', listener1);
            testSubject.removeCommandMessageListener('command1');

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, expectedResponse))
                .verifiable(Times.once());

            // trigger message
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                inputRequest,
                targetWindow,
            );

            mockBackchannelWindowMessagePoster.verifyAll();
            expect(listener1).not.toHaveBeenCalled();
        });

        test('onWindowMessage parses message request and sends back an empty response if listener elects not to respond', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;
            const inputRequest = {
                type: 'CommandMessageRequest',
                commandMessageId: 'request-id',
                command: 'command1',
                payload: 'request payload',
            };
            const expectedResponse = {
                type: 'CommandMessageResponse',
                requestCommandMessageId: 'request-id',
                payload: null,
            };

            const listener1 = async (receivedMessage, sourceWindow) => {
                return null;
            };

            testSubject.addPromiseCommandMessageListener('command1', listener1);

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, expectedResponse))
                .verifiable(Times.once());

            // trigger message
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                inputRequest,
                targetWindow,
            );

            mockBackchannelWindowMessagePoster.verifyAll();
        });

        test("onWindowMessage ignores messages that aren't related to respondable commands", async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;

            const promiseListener = jest.fn();
            const callbackListener = jest.fn();

            testSubject.addPromiseCommandMessageListener('command1', promiseListener);
            testSubject.addCallbackCommandMessageListener('command2', callbackListener);

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            // trigger message
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                { unrelated: 'message' },
                targetWindow,
            );

            mockBackchannelWindowMessagePoster.verifyAll();
            expect(promiseListener).not.toHaveBeenCalled();
            expect(callbackListener).not.toHaveBeenCalled();
        });

        test('sendPromiseCommandMessage creates deferred promise which resolves with matching response from WindowMessagePoster', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;

            const commandMessage = {
                command: 'command1',
                payload: 'message1',
            };
            const commandMessageResponseWrapper = {
                command: 'command1',
                payload: 'message1',
                requestCommandMessageId: 'unique_id',
                type: 'CommandMessageResponse',
            };

            const listener1 = jest.fn((receivedMessage, sourceWindow) => {
                return receivedMessage.payload;
            });
            const commandMessageRequestWrapper = {
                command: 'command1',
                payload: 'message1',
                commandMessageId: 'id1',
                type: 'CommandMessageRequest',
            };

            testSubject.addPromiseCommandMessageListener('command1', listener1); //will listen for 'command1' command

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, It.isAny()))
                .verifiable();

            mockPromiseFactory
                .setup(x =>
                    x.timeout(
                        It.isAny(),
                        RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds,
                    ),
                )
                .returns((originalPromise: Promise<any>) => originalPromise)
                .verifiable(Times.once());

            //create deferred promise for command
            const commandPromise = testSubject.sendPromiseCommandMessage(
                targetWindow,
                commandMessage,
            );

            //send request wrapper to window
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                commandMessageRequestWrapper,
                targetWindow,
            );

            //send response wrapper to window
            const windowMessagePromise = mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                commandMessageResponseWrapper,
                targetWindow,
            );
            const [, message] = await Promise.all([windowMessagePromise, commandPromise]); //run response request and sending response at same time
            expect(message).toEqual({ payload: 'message1' });
        });

        test('sendPromiseCommandMessage creates deferred promise which never resolves without response from WindowMessagePoster', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;

            const commandMessage = {
                command: 'command1',
                payload: 'message1',
            };
            const commandMessageResponseWrapper = {
                command: 'command1',
                payload: 'message1',
                requestCommandMessageId: 'unique_id',
                type: 'CommandMessageResponse',
            };

            const listener1 = jest.fn((receivedMessage, sourceWindow) => {
                return receivedMessage.payload;
            });
            const commandMessageRequestWrapper = {
                command: 'command1',
                payload: 'message1',
                commandMessageId: 'id1',
                type: 'CommandMessageRequest',
            };

            testSubject.addPromiseCommandMessageListener('command1', listener1); //will listen for 'command1' command

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, It.isAny()))
                .verifiable();

            mockPromiseFactory
                .setup(x =>
                    x.timeout(
                        It.isAny(),
                        RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds,
                    ),
                )
                .returns(async () => Promise.resolve())
                .verifiable(Times.once());

            //create deferred promise for command
            const commandPromise = await testSubject.sendPromiseCommandMessage(
                targetWindow,
                commandMessage,
            );

            //send request wrapper to window
            await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                commandMessageRequestWrapper,
                targetWindow,
            );

            //send response wrapper to window
            const windowMessagePromise =
                await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                    commandMessageResponseWrapper,
                    targetWindow,
                );

            const [, message] = await Promise.all([windowMessagePromise, commandPromise]); //run response request and sending response at same time

            expect(message).toEqual(undefined);
        });

        describe('timeout behavior', () => {
            const targetWindow = {} as Window;
            const commandMessage = {
                command: 'command1',
                payload: 'message1',
            };
            let recordingLogger: RecordingLogger;

            beforeEach(() => {
                recordingLogger = new RecordingLogger();

                mockBackchannelWindowMessagePoster.setup(poster =>
                    poster.postMessage(targetWindow, It.isAny()),
                );

                mockPromiseFactory
                    .setup(x =>
                        x.timeout(
                            It.isAny(),
                            RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds,
                        ),
                    )
                    .returns(() => Promise.reject(new TimeoutError('mock timeout')))
                    .verifiable(Times.once());

                testSubject = new RespondableCommandMessageCommunicator(
                    mockBackchannelWindowMessagePoster.object,
                    () => {
                        return uniqueId;
                    },
                    mockPromiseFactory.object,
                    recordingLogger,
                );
            });

            it('rejects with an error that warns about potential message interception', async () => {
                testSubject.initialize();
                await expect(
                    testSubject.sendPromiseCommandMessage(targetWindow, commandMessage),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Timed out attempting to establish communication with target window. Is there a script inside it intercepting window messages? Underlying error: mock timeout"`,
                );

                expect(recordingLogger.errorMessages).toStrictEqual([]);
            });

            it('logs an error if a response comes back after we already failed with a timeout', async () => {
                testSubject.initialize();
                await expect(
                    testSubject.sendPromiseCommandMessage(targetWindow, commandMessage),
                ).rejects.toThrowError();

                const lateResponse = {
                    command: commandMessage.command,
                    payload: 'late response message',
                    requestCommandMessageId: 'unique_id',
                    type: 'CommandMessageResponse',
                };
                await mockBackchannelWindowMessagePoster.notifyOnWindowMessage(
                    lateResponse,
                    targetWindow,
                );

                expect(recordingLogger.errorMessages).toMatchInlineSnapshot(`
                                    Array [
                                      "Received a response for command command1 after it timed out",
                                    ]
                            `);
            });
        });

        it('propogates errors from the underlying postMessage by rejecting with them as-is', async () => {
            testSubject.initialize();

            const targetWindow = {} as Window;
            const commandMessage = {
                command: 'command1',
                payload: 'message1',
            };

            const postMessageError = new Error('from underlying postMessage');

            mockBackchannelWindowMessagePoster
                .setup(poster => poster.postMessage(targetWindow, It.isAny()))
                .throws(postMessageError);

            mockPromiseFactory
                .setup(x => x.timeout(It.isAny(), It.isAny()))
                .returns(originalPromise => originalPromise);

            await expect(
                testSubject.sendPromiseCommandMessage(targetWindow, commandMessage),
            ).rejects.toThrowError(postMessageError);
        });
    });

    describe('callback message behavior', () => {
        const emptyCommand1Message = { command: 'command1', payload: {} };
        const noopReplyHandler = () => {};
        const stubGenerateUID = () => 'unique_id';
        let senderWindow: Window;
        let sender: RespondableCommandMessageCommunicator;
        let receiverWindow: Window;
        let receiver: RespondableCommandMessageCommunicator;
        let mockListener: IMock<CallbackWindowCommandMessageListener>;
        let mockReplyHandler: IMock<CommandMessageResponseCallback>;
        let senderLogger: RecordingLogger;
        let receiverLogger: RecordingLogger;

        beforeEach(() => {
            senderLogger = new RecordingLogger();
            receiverLogger = new RecordingLogger();
            const [senderPoster, receiverPoster] = LinkedWindowMessagePoster.createLinkedMockPair();
            senderWindow = senderPoster.window;
            receiverWindow = receiverPoster.window;
            sender = new RespondableCommandMessageCommunicator(
                senderPoster,
                stubGenerateUID,
                mockPromiseFactory.object,
                senderLogger,
            );
            receiver = new RespondableCommandMessageCommunicator(
                receiverPoster,
                stubGenerateUID,
                mockPromiseFactory.object,
                receiverLogger,
            );
            mockListener = Mock.ofInstance(() => {}, MockBehavior.Strict);
            mockReplyHandler = Mock.ofInstance(() => {}, MockBehavior.Strict);
            sender.initialize();
            receiver.initialize();
        });

        it('supports callback-based communcation in single-response mode', () => {
            const sentMessage: CommandMessage = {
                command: 'command1',
                payload: { request: 1 },
            };
            const response: CommandMessageResponse = {
                payload: { response: 1 },
            };
            mockListener
                .setup(l => l(sentMessage, senderWindow, It.isAny()))
                .callback((msg, sender, responder) => {
                    responder(response);
                })
                .verifiable(Times.once());
            mockReplyHandler.setup(h => h(response)).verifiable(Times.once());

            receiver.addCallbackCommandMessageListener('command1', mockListener.object);
            sender.sendCallbackCommandMessage(
                receiverWindow,
                sentMessage,
                mockReplyHandler.object,
                'single',
            );

            mockListener.verifyAll();
            mockReplyHandler.verifyAll();
            senderLogger.verifyNoErrors();
            receiverLogger.verifyNoErrors();
        });

        it('supports callback-based communcation in multiple-response mode', () => {
            const sentMessage: CommandMessage = {
                command: 'command1',
                payload: { request: 1 },
            };
            const response1: CommandMessageResponse = {
                payload: { response: 1 },
            };
            const response2: CommandMessageResponse = {
                payload: { response: 2 },
            };
            mockListener
                .setup(l => l(sentMessage, senderWindow, It.isAny()))
                .callback((msg, sender, responder) => {
                    responder(response1);
                    responder(response2);
                })
                .verifiable(Times.once());
            mockReplyHandler.setup(h => h(response1)).verifiable(Times.once());
            mockReplyHandler.setup(h => h(response2)).verifiable(Times.once());

            receiver.addCallbackCommandMessageListener('command1', mockListener.object);
            sender.sendCallbackCommandMessage(
                receiverWindow,
                sentMessage,
                mockReplyHandler.object,
                'multiple',
            );

            mockListener.verifyAll();
            mockReplyHandler.verifyAll();
            senderLogger.verifyNoErrors();
            receiverLogger.verifyNoErrors();
        });

        it('does not apply a timeout to callback messages', () => {
            sender.sendCallbackCommandMessage(
                receiverWindow,
                emptyCommand1Message,
                noopReplyHandler,
                'single',
            );
            mockPromiseFactory.verify(pf => pf.timeout(It.isAny(), It.isAny()), Times.never());
        });

        it('ignores repeated responses to a single-response message', () => {
            const sentMessage: CommandMessage = {
                command: 'command1',
                payload: { request: 1 },
            };
            const response1: CommandMessageResponse = {
                payload: { response: 1 },
            };
            const response2: CommandMessageResponse = {
                payload: { response: 2 },
            };
            mockListener
                .setup(l => l(sentMessage, senderWindow, It.isAny()))
                .callback((msg, sender, responder) => {
                    responder(response1);
                    responder(response2);
                })
                .verifiable(Times.once());
            mockReplyHandler.setup(h => h(response1)).verifiable(Times.once());
            mockReplyHandler.setup(h => h(response2)).verifiable(Times.never());

            receiver.addCallbackCommandMessageListener('command1', mockListener.object);
            sender.sendCallbackCommandMessage(
                receiverWindow,
                sentMessage,
                mockReplyHandler.object,
                'single',
            );

            mockListener.verifyAll();
            mockReplyHandler.verifyAll();
            senderLogger.verifyNoErrors();
            receiverLogger.verifyNoErrors();
        });

        it('propogates errors from the underlying postMessage by rejecting with them as-is', () => {
            const unlinkedWindow = {} as Window;
            expect(() =>
                sender.sendCallbackCommandMessage(
                    unlinkedWindow,
                    emptyCommand1Message,
                    noopReplyHandler,
                    'single',
                ),
            ).toThrowErrorMatchingInlineSnapshot(
                `"target window unreachable (LinkedWindowMessagePoster not linked to it)"`,
            );
        });

        it('handles throwing listeners by logging an error at the receiver', () => {
            const listenerError = new Error('from listener');
            const sentMessage: CommandMessage = {
                command: 'command1',
                payload: { request: 1 },
            };
            mockListener
                .setup(l => l(sentMessage, senderWindow, It.isAny()))
                .callback((msg, sender, responder) => {
                    throw listenerError;
                })
                .verifiable(Times.once());
            mockReplyHandler.setup(h => h(It.isAny())).verifiable(Times.never());

            receiver.addCallbackCommandMessageListener('command1', mockListener.object);
            sender.sendCallbackCommandMessage(
                receiverWindow,
                sentMessage,
                mockReplyHandler.object,
                'single',
            );

            mockListener.verifyAll();
            mockReplyHandler.verifyAll();
            senderLogger.verifyNoErrors();

            expect(receiverLogger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "Error at command1 listener callback: from listener",
                ]
            `);
        });

        it('handles throwing replyHandlers by logging an error at the sender', () => {
            const replyHandlerError = new Error('from replyHandler');
            const sentMessage: CommandMessage = {
                command: 'command1',
                payload: { request: 1 },
            };
            const response: CommandMessageResponse = {
                payload: { response: 1 },
            };
            mockListener
                .setup(l => l(sentMessage, senderWindow, It.isAny()))
                .callback((msg, sender, responder) => {
                    responder(response);
                })
                .verifiable(Times.once());
            mockReplyHandler
                .setup(h => h(response))
                .callback(() => {
                    throw replyHandlerError;
                })
                .verifiable(Times.once());

            receiver.addCallbackCommandMessageListener('command1', mockListener.object);
            sender.sendCallbackCommandMessage(
                receiverWindow,
                sentMessage,
                mockReplyHandler.object,
                'single',
            );

            mockListener.verifyAll();
            mockReplyHandler.verifyAll();
            receiverLogger.verifyNoErrors();

            expect(senderLogger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "Error at unique_id response callback: from replyHandler",
                ]
            `);
        });
    });
});
