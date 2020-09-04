// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { ErrorMessageContent } from './error-message-content';
import { WindowMessage } from './window-message';

// This *MUST NOT* vary between different versions or brandings of the extension!
//
// This identifier is used by some partner teams to distinguish (and allow) our messages in
// scenarios that would normally block unrecognized messages.
export const MESSAGE_STABLE_SIGNATURE = 'e467510c-ca1f-47df-ace1-a39f7f0678c9';

export class WindowMessageMarshaller {
    public readonly messageSourceId: string;
    public readonly messageVersion: string;

    constructor(browserAdapter: BrowserAdapter, private readonly generateUIDFunc: () => string) {
        const manifest = browserAdapter.getManifest();
        this.messageSourceId = manifest.name;
        this.messageVersion = manifest.version;
    }
    public parseMessage(serializedData: any): WindowMessage {
        let data;
        if (typeof serializedData !== 'string' || serializedData == null) {
            return null;
        }
        try {
            data = JSON.parse(serializedData);
            // eslint-disable-next-line no-empty
        } catch (ex) {}

        if (!this.isMessageOurs(data)) {
            return null;
        }

        return data;
    }

    public createMessage(command: string, payload: any, responseId?: string): WindowMessage {
        let error;
        if (payload instanceof Error) {
            error = {
                name: payload.name,
                message: payload.message,
                stack: payload.stack,
            } as ErrorMessageContent;
            payload = undefined;
        }

        const messageId: string = responseId ? responseId : this.generateUIDFunc();

        return {
            messageId: messageId,
            command: command,
            message: payload,
            error: error,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: this.messageSourceId,
            messageVersion: this.messageVersion,
        };
    }

    protected isMessageOurs(postedMessage: WindowMessage): boolean {
        return (
            postedMessage &&
            postedMessage.messageStableSignature === MESSAGE_STABLE_SIGNATURE &&
            postedMessage.messageSourceId === this.messageSourceId &&
            postedMessage.messageVersion === this.messageVersion &&
            typeof postedMessage.messageId === 'string'
        );
    }
}
