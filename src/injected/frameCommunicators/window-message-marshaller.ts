// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IClientChromeAdapter } from '../../common/client-browser-adapter';

export interface IWindowMessage {
    messageId: string;
    command: string;
    message?: any;
    error?: IErrorMessageContent;
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

    constructor(browserAdapter: IClientChromeAdapter, private readonly generateUIDFunc: () => string) {
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
        } catch (ex) {
        }

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

        return {
            messageId: messageId,
            command: command,
            message: payload,
            error: error,
            messageSourceId: this.messageSourceId,
            messageVersion: this.messageVersion,
        };
    }

    protected isMessageOurs(postedMessage: IWindowMessage): boolean {
        return postedMessage &&
            postedMessage.messageSourceId === this.messageSourceId &&
            postedMessage.messageVersion === this.messageVersion &&
            typeof postedMessage.messageId === 'string';
    }
}
