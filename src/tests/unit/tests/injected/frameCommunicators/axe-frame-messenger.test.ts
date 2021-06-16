// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import type * as axe from 'axe-core';
import { WindowUtils } from 'common/window-utils';
import { AxeFrameMessenger } from 'injected/frameCommunicators/axe-frame-messenger';
import { LinkedRespondableCommunicator } from 'tests/unit/common/linked-respondable-communicator';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

// These can be replaced with axe.* equivalents with axe.core@4.2.1
type TopicHandler = Parameters<AxeFrameMessenger['open']>[0];
type TopicData = Parameters<TopicHandler>[0];
type ReplyHandler = Parameters<AxeFrameMessenger['post']>[2];

// These tests simulate two AxeFrameMessagers in different browser contexts communicating with one
// another. frameMessenger1 and frameMessenger2 are initialized with LinkedRespondableCommunicators
// that are pre-linked to one another in association with stubs parentWindow and childWindow.
describe(AxeFrameMessenger, () => {
    let parentWindow: Window;
    let parentWindowUtils: WindowUtils;
    let childWindow: Window;
    let childWindowUtils: WindowUtils;
    let parentMessenger: AxeFrameMessenger;
    let childMessenger: AxeFrameMessenger;
    let parentLinkedCommunicator: LinkedRespondableCommunicator;
    let childLinkedCommunicator: LinkedRespondableCommunicator;

    let mockTopicHandler: IMock<TopicHandler>;
    let mockReplyHandler: IMock<ReplyHandler>;
    let logger: RecordingLogger;

    const noopReplyHandler = () => {};
    const singleReplyTopicData: TopicData = {
        topic: 'topic',
        channelId: 'channel',
        message: 'message',
        keepalive: false,
    };

    beforeEach(() => {
        mockTopicHandler = Mock.ofInstance((topicData, responder) => {}, MockBehavior.Strict);
        mockReplyHandler = Mock.ofInstance((message, keepalive, responder) => {},
        MockBehavior.Strict);
        logger = new RecordingLogger();

        [parentLinkedCommunicator, childLinkedCommunicator] =
            LinkedRespondableCommunicator.createLinkedMockPair();
        parentWindow = parentLinkedCommunicator.window;
        parentWindowUtils = { getParentWindow: () => null } as WindowUtils;
        parentMessenger = new AxeFrameMessenger(
            parentLinkedCommunicator,
            parentWindowUtils,
            logger,
        );
        childWindow = childLinkedCommunicator.window;
        childWindowUtils = { getParentWindow: () => parentWindow } as WindowUtils;
        childMessenger = new AxeFrameMessenger(childLinkedCommunicator, childWindowUtils, logger);
    });

    describe('post/open communication', () => {
        it('invokes topicHandlers in response to corresponding posts', () => {
            mockTopicHandler
                .setup(m => m(It.isObjectWith(singleReplyTopicData), It.isAny()))
                .verifiable();

            childMessenger.open(mockTopicHandler.object);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                noopReplyHandler,
            );

            logger.verifyNoErrors();
            mockTopicHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('invokes replyHandlers in response to corresponding replies', () => {
            const replyMessage = 'reply message';
            mockReplyHandler.setup(m => m(replyMessage, false, It.isAny())).verifiable();

            const topicHandler = (_input, responder) => {
                responder(replyMessage);
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                mockReplyHandler.object,
            );

            logger.verifyNoErrors();
            mockReplyHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('supports invoking replyHandlers multiple times if keepalive is true', () => {
            const firstReply = 'first reply';
            const secondReply = 'second reply';
            mockReplyHandler.setup(m => m(firstReply, false, It.isAny())).verifiable();
            mockReplyHandler.setup(m => m(secondReply, false, It.isAny())).verifiable();

            const topicData = {
                ...singleReplyTopicData,
                keepalive: true,
            };
            const topicHandler = (_input, responder) => {
                responder(firstReply);
                responder(secondReply);
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                topicData,
                mockReplyHandler.object,
            );

            logger.verifyNoErrors();
            mockReplyHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('passes messages to each topicHandler if multiple are registered', () => {
            const firstMockTopicHandler: IMock<TopicHandler> = Mock.ofInstance(() => {},
            MockBehavior.Strict);
            const secondMockTopicHandler: IMock<TopicHandler> = Mock.ofInstance(() => {},
            MockBehavior.Strict);

            firstMockTopicHandler
                .setup(m => m(It.isObjectWith(singleReplyTopicData), It.isAny()))
                .verifiable();

            secondMockTopicHandler
                .setup(m => m(It.isObjectWith(singleReplyTopicData), It.isAny()))
                .verifiable();

            const closeFirst = childMessenger.open(firstMockTopicHandler.object);
            const closeSecond = childMessenger.open(secondMockTopicHandler.object);

            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                noopReplyHandler,
            );

            expect(closeFirst).not.toThrow();
            expect(closeSecond).not.toThrow();

            logger.verifyNoErrors();
            firstMockTopicHandler.verifyAll();
            secondMockTopicHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('does not multi-invoke replyHandlers if keepalive is false', () => {
            const firstReply = 'first reply';
            const secondReply = 'second reply';
            mockReplyHandler.setup(m => m(firstReply, false, It.isAny())).verifiable();
            mockReplyHandler
                .setup(m => m(secondReply, false, It.isAny()))
                .verifiable(Times.never());

            const topicData = {
                ...singleReplyTopicData,
                keepalive: false,
            };
            const topicHandler = (_input, responder) => {
                responder(firstReply);
                responder(secondReply);
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                topicData,
                mockReplyHandler.object,
            );

            logger.verifyNoErrors();
            mockReplyHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('returns false and logs an error if the underlying communicator fails', () => {
            const unlinkedWindow = {} as Window;
            const postReturn = parentMessenger.post(
                unlinkedWindow,
                singleReplyTopicData,
                noopReplyHandler,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "Error while attempting to send axe-core frameMessenger message: target window unreachable (LinkedRespondableCommunicator not linked to it)",
                ]
            `);
            mockTopicHandler.verifyAll();
            expect(postReturn).toBe(false);
        });

        it("returns true and trusts in axe-core's timeout behavior if other side doesn't respond", () => {
            const noopTopicHandler = () => {};
            childMessenger.open(noopTopicHandler);

            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                mockReplyHandler.object,
            );

            logger.verifyNoErrors();
            mockReplyHandler.verify(m => m(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(postReturn).toBe(true);
        });

        it('does not invoke closed topic handlers', () => {
            const close = childMessenger.open(mockTopicHandler.object);
            close();
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                noopReplyHandler,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "Error while attempting to send axe-core frameMessenger message: target window reachable, but is not listening for command axe.frameMessenger.post",
                ]
            `);
            mockTopicHandler.verify(m => m(It.isAny(), It.isAny()), Times.never());
            expect(postReturn).toBe(false);
        });

        it('passes a generic Error object to the replyHandler if a topicHandler throws', () => {
            const topicHandler = () => {
                throw new Error('from topicHandler');
            };
            mockReplyHandler
                .setup(m => m(It.isAnyObject(Error), false, It.isAny()))
                .callback(receivedError => {
                    expect(receivedError.message).toMatchInlineSnapshot(
                        `"An axe-core error occurred in a child frame."`,
                    );
                });

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                mockReplyHandler.object,
            );

            logger.verifyNoErrors();
            mockReplyHandler.verifyAll();
            expect(postReturn).toBe(true);
        });

        it('logs an error and noops if a replyHandler throws', () => {
            const topicHandler = (_input, responder) => {
                responder('topicHandler reply message');
            };
            const replyHandler = (_replyMessage, _keepalive, replyToReplyHandler) => {
                throw new Error('replyHandler error');
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                replyHandler,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "An axe-core error occurred while processing a result from a child frame.",
                ]
            `);
            expect(postReturn).toBe(true);
        });

        it('does not accept messages that originate from non-parent windows', () => {
            parentMessenger.open(mockTopicHandler.object);
            const postReturn = childMessenger.post(
                parentWindow,
                singleReplyTopicData,
                mockReplyHandler.object,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "Received unexpected axe-core message from a non-parent window",
                ]
            `);
            mockTopicHandler.verify(m => m(It.isAny(), It.isAny()), Times.never());
            mockReplyHandler.verify(m => m(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(postReturn).toBe(true);
        });

        it('logs an error and continues if a replyHandler attempts to reply to a reply', () => {
            const replyMessage = 'reply message';
            const topicHandler = (_input, responder) => {
                responder(replyMessage);
            };
            const replyHandler = (_replyMessage, _keepalive, replyToReplyHandler) => {
                expect(() => replyToReplyHandler('reply to reply')).not.toThrow();
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                replyHandler,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "AxeFrameMessenger does not support replies-to-replies, but a post replyHandler invoked a responder.",
                ]
            `);
            expect(postReturn).toBe(true);
        });

        it('logs an error and continues if a topicHandler attempts support handling replies-to-replies', () => {
            const replyMessage = 'reply message';
            const topicHandler = (_input, responder) => {
                // Shouldn't throw, just log an error
                expect(() => responder(replyMessage, false, mockReplyHandler.object)).not.toThrow();
            };

            childMessenger.open(topicHandler);
            const postReturn = parentMessenger.post(
                childWindow,
                singleReplyTopicData,
                noopReplyHandler,
            );

            expect(logger.errorMessages).toMatchInlineSnapshot(`
                Array [
                  "AxeFrameMessenger does not support replies-to-replies, but a topicHandler provided a replyHandler in a response callback.",
                ]
            `);
            mockReplyHandler.verify(m => m(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(postReturn).toBe(true);
        });
    });

    describe('registerGlobally', () => {
        it("defers to axe-core's frameMessenger", () => {
            const mockFrameMessenger = Mock.ofInstance<typeof axe.frameMessenger>(() => {});
            const mockAxe = {
                frameMessenger: mockFrameMessenger.object,
            } as typeof axe;

            const testSubject = new AxeFrameMessenger(null, null, null);

            testSubject.registerGlobally(mockAxe);

            mockFrameMessenger.verify(m => m(testSubject as any), Times.once());
        });
    });
});
