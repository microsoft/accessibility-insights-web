// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BackchannelRetrieveRequestMessage,
    BackchannelRetrieveResponseMessage,
    BackchannelStoreRequestMessage,
} from 'common/types/backchannel-message-type';
import { WindowUtils } from 'common/window-utils';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';

// This *MUST NOT* vary between different versions or brandings of the extension!
//
// This identifier is used by some partner teams to distinguish (and allow) our messages in
// scenarios that would normally block unrecognized messages.
export const MESSAGE_STABLE_SIGNATURE = 'e467510c-ca1f-47df-ace1-a39f7f0678c9';

export type BackchannelMessagePair = {
    windowMessageMetadata: WindowMessageMetadata;
    backchannelMessage: BackchannelStoreRequestMessage;
};

export interface WindowMessageMetadata {
    messageId: string;
    messageStableSignature: string;
    messageSourceId: string;
    messageVersion: string;
}

// BackchannelWindowMessageTranslator is responsible for:
// * converting received window messages into pieces to go to the backchannel and to go to frames
// * generating unique and random IDs for messages
// * parsing and creating messages:
//   * WindowMessage --> BackchannelMessagePair ({BackchannelStoreRequestMessage, WindowMessageMetadata})
//   * WindowMessage --> BackchannelRetrieveRequestMessage
//   * BackchannelStoreRequestMessage --> BackchannelRetrieveResponseMessage
export class BackchannelWindowMessageTranslator {
    public readonly messageSourceId: string;
    public readonly messageVersion: string;

    constructor(
        browserAdapter: BrowserAdapter,
        private readonly winUtils: WindowUtils,
        private readonly generateUIDFunc: () => string,
    ) {
        this.winUtils = winUtils;
        const manifest = browserAdapter.getManifest();
        this.messageSourceId = `${manifest.name}-BackchannelWindowMessageTranslator`;
        this.messageVersion = manifest.version;
    }

    public splitWindowMessage(payload: any): BackchannelMessagePair {
        const messageId: string = this.generateRandomAndUniqueID();
        return {
            windowMessageMetadata: this.createWindowMessageMetadata(messageId),
            backchannelMessage: this.createBackchannelMessage(payload, messageId),
        };
    }

    private createBackchannelMessage(
        payload: any,
        messageId: string,
    ): BackchannelStoreRequestMessage {
        return {
            messageId: messageId,
            messageType: 'backchannel_window_message.store_request',
            stringifiedMessageData: JSON.stringify(payload),
        };
    }

    private createWindowMessageMetadata(messageId: string): WindowMessageMetadata {
        return {
            messageId: messageId,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: this.messageSourceId,
            messageVersion: this.messageVersion,
        };
    }

    private generateRandomAndUniqueID(): string {
        return `${this.generateUIDFunc()}_${btoa(
            this.winUtils.getRandomValueArray(32).toString(),
        )}`;
    }

    // This will return null for any message which does not appear to come from us.
    // In particular, it will return null for any message with the a type layout, source ID,
    // stable signature, etc which does not appear to have been created by Accessibility Insights.
    public tryCreateBackchannelReceiveMessage(
        rawReceivedWindowMessage: any,
    ): BackchannelRetrieveRequestMessage | null {
        const parsedReceivedWindowMessage = this.tryParseJson(rawReceivedWindowMessage);
        return this.isMessageOurs(parsedReceivedWindowMessage)
            ? {
                  messageId: parsedReceivedWindowMessage.messageId,
                  messageType: 'backchannel_window_message.retrieve_request',
              }
            : null;
    }

    // This will return null for any message which is not directed towards the Backchannel
    public tryParseBackchannelRetrieveResponseMessage(
        rawBackchannelMessage: any,
    ): BackchannelRetrieveResponseMessage | null {
        return this.isStoreResponseMessage(rawBackchannelMessage)
            ? {
                  messageId: rawBackchannelMessage.messageId,
                  messageType: 'backchannel_window_message.retrieve_response',
                  stringifiedMessageData: rawBackchannelMessage.stringifiedMessageData,
              }
            : null;
    }

    //postedMessage could originate from outside scripts calling window.postMessage
    //and therefore we need more thorough validation than when we check if a message is directed
    //to the backchannel (those messages always come from our extension)
    protected isMessageOurs(postedMessage: any): boolean {
        return (
            postedMessage != null &&
            typeof postedMessage === 'object' &&
            postedMessage.messageStableSignature === MESSAGE_STABLE_SIGNATURE &&
            postedMessage.messageSourceId === this.messageSourceId &&
            postedMessage.messageVersion === this.messageVersion &&
            typeof postedMessage.messageId === 'string'
        );
    }

    //we can assume anything passed to this function comes from our extension
    //making the validation much more simplistic
    protected isStoreResponseMessage(postedMessage: any): boolean {
        return (
            postedMessage &&
            postedMessage.messageType === 'backchannel_window_message.retrieve_response'
        );
    }

    private tryParseJson(rawWindowMessage: unknown): any | null {
        if (typeof rawWindowMessage !== 'string') {
            return null;
        }
        try {
            return JSON.parse(rawWindowMessage);
        } catch {
            return null;
        }
    }
}
