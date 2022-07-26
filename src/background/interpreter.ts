// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InterpreterMessage, InterpreterResponse, PayloadCallback } from '../common/message';
import { DictionaryStringTo } from '../types/common-types';

export class Interpreter {
    protected messageToActionMapping: DictionaryStringTo<PayloadCallback<any>> = {};

    public registerTypeToPayloadCallback = <Payload>(
        messageType: string,
        callback: PayloadCallback<Payload>,
    ): void => {
        this.messageToActionMapping[messageType] = callback;
    };

    public interpret(message: InterpreterMessage): InterpreterResponse {
        if (this.messageToActionMapping[message.messageType]) {
            return {
                messageHandled: true,
                result: this.messageToActionMapping[message.messageType](
                    message.payload,
                    message.tabId,
                ),
            };
        }
        return { messageHandled: false };
    }
}
