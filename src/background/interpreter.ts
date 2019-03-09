// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

export class Interpreter {
    protected messageToActionMapping: IDictionaryStringTo<IPayloadCallback> = {};

    @autobind
    public registerTypeToPayloadCallback(messageType: string, callback: IPayloadCallback): void {
        this.messageToActionMapping[messageType] = callback;
    }

    public interpret(message: IMessage): boolean {
        if (this.messageToActionMapping[message.type]) {
            this.messageToActionMapping[message.type](message.payload, message.tabId);
            return true;
        }
        return false;
    }
}
