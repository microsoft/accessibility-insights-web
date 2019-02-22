// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientBrowserAdapter } from '../../common/client-browser-adapter';

// This *MUST NOT* vary between different versions or brandings of the extension!
//
// This identifier is used by some partner teams to distinguish (and allow) our messages in
// scenarios that would normally block unrecognized messages.
export const STABLE_MESSAGE_SIGNATURE = 'e467510c-ca1f-47df-ace1-a39f7f0678c9';

export interface IWindowMessage {
    messageId: string;
    command: string;
    message?: any;
    error?: IErrorMessageContent;
    messageStableSignature: string;
    messageSourceId: string;
    messageVersion: string;
}

export interface IErrorMessageContent {
    name: string;
    message: string;
    stack: string;
}

export class WindowMessageMarshaller {
    public readonly messageSourceId: string;
    public readonly messageVersion: string;

    constructor(browserAdapter: ClientBrowserAdapter, private readonly generateUIDFunc: () => string) {
        const manifest = browserAdapter.getManifest();
        this.messageSourceId = manifest.name;
        this.messageVersion = manifest.version;
    }
    public parseMessage(serializedData: any): IWindowMessage {
        let data;
        if (typeof serializedData !== 'string' || serializedData == null) {
            return null;
        }
        try {
            data = JSON.parse(serializedData);
            // tslint:disable-next-line:no-empty
        } catch (ex) {}

        if (!this.isMessageOurs(data)) {
            return null;
        }

        return data;
    }

    public createMessage(command: string, payload: any, responseId?: string): IWindowMessage {
        let error;
        if (payload instanceof Error) {
            error = {
                name: payload.name,
                message: payload.message,
                stack: payload.stack,
            } as IErrorMessageContent;
            payload = undefined;
        }

        const messageId: string = responseId ? responseId : this.generateUIDFunc();

        // For the sake of partner teams that depend on recognizing our window messages to avoid
        // treating them as malicious, it is important that the shape of this message envelope remains
        // a superset of the following exact structure:
        //
        // {
        //     messageStableSignature: STABLE_MESSAGE_SIGNATURE
        // }
        return {
            messageId: messageId,
            command: command,
            message: payload,
            error: error,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: this.messageSourceId,
            messageVersion: this.messageVersion,
        };
    }

    protected isMessageOurs(postedMessage: IWindowMessage): boolean {
        return (
            postedMessage &&
            postedMessage.messageStableSignature === STABLE_MESSAGE_SIGNATURE &&
            postedMessage.messageSourceId === this.messageSourceId &&
            postedMessage.messageVersion === this.messageVersion &&
            typeof postedMessage.messageId === 'string'
        );
    }
}
