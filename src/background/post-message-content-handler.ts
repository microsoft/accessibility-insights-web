// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InterpreterMessage } from '../common/message';
import {
    BackchannelRequestMessage,
    BackchannelRequestMessageType,
    BackchannelStoreRequestMessage,
    BackchannelRetrieveResponseMessage,
} from '../common/types/backchannel-message-type';
import { PostMessageContentRepository } from './post-message-content-repository';

export type BackchannelMessageResponse = {
    success: boolean;
    response?: any;
};

export class PostMessageContentHandler {
    constructor(private readonly postMessageContentRepository: PostMessageContentRepository) {}

    private storeContentOnMessageReceived = (message: BackchannelRequestMessage): void => {
        const storeRequestMessage = message as BackchannelStoreRequestMessage;
        this.postMessageContentRepository.storeContent(
            storeRequestMessage.messageId,
            storeRequestMessage.stringifiedMessageData,
        );
    };

    // It's important that this is NOT an async function. See
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage
    private retrieveContentOnMessageReceived = (
        message: BackchannelRequestMessage,
    ): Promise<BackchannelRetrieveResponseMessage> | void => {
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

    // Map enforces that every BackchannelRequestMessageType has a handler
    private readonly messageHandlers: {
        [key in BackchannelRequestMessageType]: (
            message: BackchannelRequestMessage,
        ) => void | Promise<BackchannelRetrieveResponseMessage>;
    } = {
        'backchannel_window_message.retrieve_request': this.retrieveContentOnMessageReceived,
        'backchannel_window_message.store_request': this.storeContentOnMessageReceived,
    };

    public handleMessage(message: InterpreterMessage): BackchannelMessageResponse {
        if (Object.keys(this.messageHandlers).includes(message.messageType)) {
            return {
                success: true,
                response: this.messageHandlers[message.messageType](
                    message as BackchannelRequestMessage,
                ),
            };
        }

        return { success: false };
    }
}
