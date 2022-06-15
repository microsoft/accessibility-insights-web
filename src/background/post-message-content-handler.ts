// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
import { InterpreterMessage } from '../common/message';
import {
    BackchannelRequestMessage,
    BackchannelStoreRequestMessage,
    BackchannelRetrieveResponseMessage,
} from '../common/types/backchannel-message-type';
import { PostMessageContentRepository } from './post-message-content-repository';

export class PostMessageContentHandler {
    constructor(private readonly postMessageContentRepository: PostMessageContentRepository) {}

    private storeContentOnMessageReceived = (message: BackchannelStoreRequestMessage): void => {
        this.postMessageContentRepository.storeContent(
            message.messageId,
            message.stringifiedMessageData,
        );
    };

    private retrieveContentOnMessageReceived = async (
        message: BackchannelRequestMessage,
    ): Promise<BackchannelRetrieveResponseMessage> => {
        const content = this.postMessageContentRepository.popContent(message.messageId);
        return {
            messageType: 'backchannel_window_message.retrieve_response',
            messageId: message.messageId,
            stringifiedMessageData: content,
        };
    };

    public handleBrowserMessage(message: InterpreterMessage): BrowserMessageResponse {
        switch (message.messageType) {
            case 'backchannel_window_message.retrieve_request':
                return {
                    messageHandled: true,
                    result: this.retrieveContentOnMessageReceived(
                        message as BackchannelRequestMessage,
                    ),
                };
            case 'backchannel_window_message.store_request':
                this.storeContentOnMessageReceived(message as BackchannelStoreRequestMessage);
                return {
                    messageHandled: true,
                    result: Promise.resolve(),
                };
            default:
                return { messageHandled: false };
        }
    }
}
