// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PostMessageContentHandler } from 'background/post-message-content-handler';
import { PostMessageContentRepository } from 'background/post-message-content-repository';
import {
    BackchannelStoreRequestMessage,
    BackchannelRetrieveRequestMessage,
    BackchannelRetrieveResponseMessage,
} from 'common/types/backchannel-message-type';
import {
    createSimulatedBrowserAdapter,
    SimulatedBrowserAdapter,
} from 'tests/unit/common/simulated-browser-adapter';
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
    let mockBrowserAdapter: SimulatedBrowserAdapter;
    let testSubject: PostMessageContentHandler;

    beforeEach(() => {
        mockPostMessageContentRepository = Mock.ofType<PostMessageContentRepository>();
        mockBrowserAdapter = createSimulatedBrowserAdapter();
        testSubject = new PostMessageContentHandler(
            mockPostMessageContentRepository.object,
            mockBrowserAdapter.object,
        );
        testSubject.initialize();
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

        mockBrowserAdapter.notifyOnMessage(storeMessage);

        mockPostMessageContentRepository.verifyAll();
    });

    it('does not attempt to store content when the messageType is irrelevant', () => {
        mockPostMessageContentRepository
            .setup(repository => repository.storeContent(It.isAnyString(), It.isAnyString()))
            .verifiable(Times.never());

        const messageStub = {
            messageType: 'irrelevant-type' as any,
        } as BackchannelStoreRequestMessage;
        expect(mockBrowserAdapter.notifyOnMessage(messageStub)).not.toBeInstanceOf(Promise);

        mockPostMessageContentRepository.verifyAll();
    });

    it('resolves with the response message when retrieving content', async () => {
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(retrieveRequestMessage.messageId))
            .returns(() => retrieveResponseMessage.stringifiedMessageData)
            .verifiable(Times.once());

        const response = mockBrowserAdapter.notifyOnMessage(retrieveRequestMessage);

        expect(response).toBeInstanceOf(Promise);
        expect(await response).toEqual(retrieveResponseMessage);

        mockPostMessageContentRepository.verifyAll();
    });

    it('does not attempt to retrieve content when the messageType is irrelevant', () => {
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(It.isAnyString()))
            .verifiable(Times.never());

        const messageStub = {
            messageType: 'irrelevant-type' as any,
        } as BackchannelRetrieveRequestMessage;

        expect(mockBrowserAdapter.notifyOnMessage(messageStub)).not.toBeInstanceOf(Promise);
        mockPostMessageContentRepository.verifyAll();
    });

    it('rejects when the content could not be retrieved', async () => {
        const errorMessage = 'test error message';
        mockPostMessageContentRepository
            .setup(repository => repository.popContent(retrieveRequestMessage.messageId))
            .throws(new Error(errorMessage))
            .verifiable(Times.once());

        const response = mockBrowserAdapter.notifyOnMessage(retrieveRequestMessage);

        expect(response).toBeInstanceOf(Promise);
        await expect(response).rejects.toThrowError(errorMessage);

        mockPostMessageContentRepository.verifyAll();
    });
});
