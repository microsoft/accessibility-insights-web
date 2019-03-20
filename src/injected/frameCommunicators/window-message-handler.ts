// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { WindowUtils } from '../../common/window-utils';
import { DictionaryStringTo } from '../../types/common-types';
import { IErrorMessageContent, IWindowMessage, WindowMessageMarshaller } from './window-message-marshaller';

export type FrameMessageResponseCallback = (
    result: any,
    error: IErrorMessageContent,
    messageSourceWindow: Window,
    responder?: FrameMessageResponseCallback,
) => void;

export class WindowMessageHandler {
    private _windowUtils: WindowUtils;
    private _initialized: boolean;
    private _windowMessageParser: WindowMessageMarshaller;
    private _callbacksForMessagesSentFromCurrentFrame: { [messageId: string]: FrameMessageResponseCallback } = {};

    private _messageSubscribers: DictionaryStringTo<FrameMessageResponseCallback>;

    constructor(windowUtils: WindowUtils, windowMessageParser: WindowMessageMarshaller) {
        this._windowUtils = windowUtils;
        this._windowMessageParser = windowMessageParser;
        this._messageSubscribers = {};
    }

    public addSubscriber(command: string, callback: FrameMessageResponseCallback): void {
        if (!this._messageSubscribers[command]) {
            this._messageSubscribers[command] = callback;
        }
    }

    public removeSubscriber(command): void {
        delete this._messageSubscribers[command];
    }

    public initialize(): void {
        if (!this._initialized) {
            this._initialized = true;
            this._windowUtils.addEventListener(window, 'message', this.windowMessageHandler, false);
        }
    }

    public dispose(): void {
        this._windowUtils.removeEventListener(window, 'message', this.windowMessageHandler, false);
    }

    public post(win: Window, command: string, message: any, callback?: FrameMessageResponseCallback, responseId?: string): void {
        const data = this._windowMessageParser.createMessage(command, message, responseId);

        this.updateResponseCallbackMap(data.messageId, callback);

        this._windowUtils.postMessage(win, data, '*');
    }

    @autobind
    private windowMessageHandler(e: MessageEvent): void {
        const data: IWindowMessage = this._windowMessageParser.parseMessage(e.data);
        if (data == null) {
            return;
        }
        const messageId = data.messageId;
        const callback = this._callbacksForMessagesSentFromCurrentFrame[messageId];

        try {
            if (callback) {
                this.processResponseFromPreviousRequest(e.source, data, callback);
            } else {
                this.processNewMessage(e.source, data);
            }
        } catch (err) {
            this.post(e.source, data.command, err, null, messageId);
        }
    }

    private updateResponseCallbackMap(messageId, callback): void {
        if (callback) {
            this._callbacksForMessagesSentFromCurrentFrame[messageId] = callback;
        } else {
            delete this._callbacksForMessagesSentFromCurrentFrame[messageId];
        }
    }

    private processResponseFromPreviousRequest(source: Window, data: IWindowMessage, callback: FrameMessageResponseCallback): void {
        const responderCallback = this.createFrameResponderCallback(source, data.command, data.messageId);
        callback(data.message, data.error, source, responderCallback);
        delete this._callbacksForMessagesSentFromCurrentFrame[data.messageId];
    }

    private processNewMessage(source: Window, data: IWindowMessage): void {
        this.notifySubscriber(source, data);
    }

    public createFrameResponderCallback(windowSource: Window, command: string, messageId: string): FrameMessageResponseCallback {
        return (result: any, error: IErrorMessageContent, messageSourceWin: Window, callback?: FrameMessageResponseCallback) => {
            this.post(windowSource, command, result, callback, messageId);
        };
    }

    private notifySubscriber(target: Window, data: IWindowMessage): void {
        const subscriber = this._messageSubscribers[data.command];
        if (subscriber) {
            subscriber(data.message, data.error, target, this.createFrameResponderCallback(target, data.command, data.messageId));
        }
    }
}
