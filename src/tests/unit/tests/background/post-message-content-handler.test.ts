// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { PostMessageContentRepository } from 'background/post-message-content-repository';
import { InterpreterMessage } from 'common/message';
import {
    BackchannelStoreRequestMessage,
    BackchannelRetrieveRequestMessage,
    BackchannelRetrieveResponseMessage,
} from 'common/types/backchannel-message-type';
import { IMock, It, Mock, Times } from 'typemoq';

describe('PostMessageContentHandlerTest', () => {
    const storeMessage: BackchannelStoreRequestMessage = {
        messageId: 'test-token',
        messageType: 'backchannel_window_message.store_request',
        stringifiedMessageData: 'test-content',
    };
    const retrieveRequestMessage: BackchannelRetrieveRequestMessage = {
        messageId: 'test-token',
        messageType: 'backchannel_window_message.retrieve_request',
    };
    const retrieveResponseMessage: BackchannelRetrieveResponseMessage = {
        messageId: 'test-token',
        messageType: 'backchannel_window_message.retrieve_response',
        stringifiedMessageData: 'test-content',
    };

    let mockPostMessageContentRepository: IMock<PostMessageContentRepository>;
    let testSubject: PostMessageContentHandler;

    beforeEach(() => {
        mockPostMessageContentRepository = Mock.ofType<PostMessageContentRepository>();
        testSubject = new PostMessageContentHandler(mockPostMessageContentRepository.object);
    });

    it('stores content in PostMessageContentRepository when the corresponding message is received', () => {
        mockPostMessageContentRepository
            .setup(repository =>
                repository.storeContent(
                    storeMessage.messageId,
                    storeMessage.stringifiedMessageData,
                ),
            )
            .verifiable(Times.once());

        testSubject.handleMessage(storeMessage);

        mockPostMessageContentRepository.verifyAll();
    });

    it('resolves with the response message when retrieving content', async () => {
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(retrieveRequestMessage.messageId))
            .returns(() => retrieveResponseMessage.stringifiedMessageData)
            .verifiable(Times.once());

        const { messageHandled: success, response } =
            testSubject.handleMessage(retrieveRequestMessage);

        expect(success).toBeTruthy();
        expect(response).toBeInstanceOf(Promise);
        expect(await response).toEqual(retrieveResponseMessage);

        mockPostMessageContentRepository.verifyAll();
    });

    it('does not attempt to store or retrieve content when the messageType is irrelevant', () => {
        mockPostMessageContentRepository
            .setup(repository => repository.storeContent(It.isAnyString(), It.isAnyString()))
            .verifiable(Times.never());
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(It.isAnyString()))
            .verifiable(Times.never());

        const messageStub = {
            messageType: 'irrelevant-type' as any,
        } as InterpreterMessage;

        const { messageHandled: success, response } = testSubject.handleMessage(messageStub);

        expect(success).toBeFalsy();
        expect(response).not.toBeInstanceOf(Promise);
        mockPostMessageContentRepository.verifyAll();
    });

    it('rejects when the content could not be retrieved', async () => {
        const errorMessage = 'test error message';
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(retrieveRequestMessage.messageId))
            .throws(new Error(errorMessage))
            .verifiable(Times.once());

        const { messageHandled: success, response } =
            testSubject.handleMessage(retrieveRequestMessage);

        expect(success).toBeTruthy();
        expect(response).toBeInstanceOf(Promise);
        await expect(response).rejects.toThrowError(errorMessage);

        mockPostMessageContentRepository.verifyAll();
    });
});
