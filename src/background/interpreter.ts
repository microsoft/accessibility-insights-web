// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="../common/message.d.ts" />
import { autobind } from '@uifabric/utilities';

export class Interpreter {
    protected _messageToActionMapping: IDictionaryStringTo<IPayloadCallback> = {};

    @autobind
    public registerTypeToPayloadCallback(messageType: string, callback: IPayloadCallback): void {
        this._messageToActionMapping[messageType] = callback;
    }

    public interpret(message: IMessage): boolean {
        if (this._messageToActionMapping[message.type]) {
            this._messageToActionMapping[message.type](message.payload, message.tabId);
            return true;
        }
        return false;
    }
}
