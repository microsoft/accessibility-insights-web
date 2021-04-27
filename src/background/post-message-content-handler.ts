// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PostMessageContentRepository } from 'background/post-message-content-repository';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import {
    BackchannelRetrieveRequestMessage,
    BackchannelRetrieveResponseMessage,
    BackchannelStoreRequestMessage,
} from 'common/types/backchannel-message-type';

export class PostMessageContentHandler {
    constructor(
        private readonly postMessageContentRepository: PostMessageContentRepository,
        private readonly browserAdapter: BrowserAdapter,
    ) {}

    public initialize = (): void => {
        this.browserAdapter.addListenerOnMessage(this.storeContentOnMessageReceived);
        this.browserAdapter.addListenerOnMessage(this.retrieveContentOnMessageReceived);
    };

    private storeContentOnMessageReceived = (message: BackchannelStoreRequestMessage): void => {
        if (message.messageType !== 'backchannel_window_message.store_request') {
            return;
        }

        this.postMessageContentRepository.storeContent(
            message.messageId,
            message.stringifiedMessageData,
        );
    };

    // It's important that this is NOT an async function. See
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage
    private retrieveContentOnMessageReceived = (
        message: BackchannelRetrieveRequestMessage,
    ): Promise<BackchannelRetrieveResponseMessage> | void => {
        if (message.messageType !== 'backchannel_window_message.retrieve_request') {
            return;
        }

        let content: string;
        try {
            content = this.postMessageContentRepository.popContent(message.messageId);
        } catch (error) {
            return Promise.reject(error);
        }

        const responseMessage: BackchannelRetrieveResponseMessage = {
            messageType: 'backchannel_window_message.retrieve_response',
            messageId: message.messageId,
            stringifiedMessageData: content,
        };

        return Promise.resolve(responseMessage);
    };
}
