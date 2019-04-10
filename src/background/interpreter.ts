// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Message, PayloadCallback } from '../common/message';
import { DictionaryStringTo } from '../types/common-types';

export class Interpreter {
    protected messageToActionMapping: DictionaryStringTo<PayloadCallback> = {};

    @autobind
    public registerTypeToPayloadCallback(messageType: string, callback: PayloadCallback): void {
        this.messageToActionMapping[messageType] = callback;
    }

    public interpret(message: Message): boolean {
        if (this.messageToActionMapping[message.type]) {
            this.messageToActionMapping[message.type](message.payload, message.tabId);
            return true;
        }
        return false;
    }
}
