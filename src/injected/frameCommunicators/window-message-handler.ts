// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from '../../common/window-utils';
import { DictionaryStringTo } from '../../types/common-types';
import { ErrorMessageContent } from './error-message-content';
import { WindowMessage } from './window-message';
import { WindowMessageMarshaller } from './window-message-marshaller';

export type FrameMessageResponseCallback = (
    result: any | undefined,
    error: ErrorMessageContent | undefined,
    messageSourceWindow: Window,
    responder?: FrameMessageResponseCallback,
) => void;

export class WindowMessageHandler {
    private windowUtils: WindowUtils;
    private initialized: boolean;
    private windowMessageParser: WindowMessageMarshaller;
    private callbacksForMessagesSentFromCurrentFrame: {
        [messageId: string]: FrameMessageResponseCallback;
    } = {};

    private messageSubscribers: DictionaryStringTo<FrameMessageResponseCallback>;

    constructor(windowUtils: WindowUtils, windowMessageParser: WindowMessageMarshaller) {
        this.windowUtils = windowUtils;
        this.windowMessageParser = windowMessageParser;
        this.messageSubscribers = {};
    }

    public addSubscriber(command: string, callback: FrameMessageResponseCallback): void {
        if (!this.messageSubscribers[command]) {
            this.messageSubscribers[command] = callback;
        }
    }

    public removeSubscriber(command): void {
        delete this.messageSubscribers[command];
    }

    public initialize(): void {
        if (!this.initialized) {
            this.initialized = true;
            this.windowUtils.addEventListener(window, 'message', this.windowMessageHandler, false);
        }
    }

    public dispose(): void {
        this.windowUtils.removeEventListener(window, 'message', this.windowMessageHandler, false);
    }

    public post(
        win: Window,
        command: string,
        message: any,
        callback?: FrameMessageResponseCallback,
        responseId?: string,
    ): void {
        const data = this.windowMessageParser.createMessage(command, message, responseId);

        this.updateResponseCallbackMap(data.messageId, callback);

        this.windowUtils.postMessage(win, data, '*');
    }

    private windowMessageHandler = (e: MessageEvent): void => {
        const sourceWindow = e.source as Window;
        const data: WindowMessage | null = this.windowMessageParser.parseMessage(e.data);
        if (data == null) {
            return;
        }
        const messageId = data.messageId;
        const callback = this.callbacksForMessagesSentFromCurrentFrame[messageId];

        try {
            if (callback) {
                this.processResponseFromPreviousRequest(sourceWindow, data, callback);
            } else {
                this.processNewMessage(sourceWindow, data);
            }
        } catch (err) {
            this.post(sourceWindow, data.command, err, undefined, messageId);
        }
    };

    private updateResponseCallbackMap(
        messageId: string,
        callback?: FrameMessageResponseCallback,
    ): void {
        if (callback) {
            this.callbacksForMessagesSentFromCurrentFrame[messageId] = callback;
        } else {
            delete this.callbacksForMessagesSentFromCurrentFrame[messageId];
        }
    }

    private processResponseFromPreviousRequest(
        source: Window,
        data: WindowMessage,
        callback: FrameMessageResponseCallback,
    ): void {
        const responderCallback = this.createFrameResponderCallback(
            source,
            data.command,
            data.messageId,
        );
        callback(data.message, data.error, source, responderCallback);
        delete this.callbacksForMessagesSentFromCurrentFrame[data.messageId];
    }

    private processNewMessage(source: Window, data: WindowMessage): void {
        this.notifySubscriber(source, data);
    }

    public createFrameResponderCallback(
        windowSource: Window,
        command: string,
        messageId: string,
    ): FrameMessageResponseCallback {
        return (
            result: any,
            error: ErrorMessageContent,
            messageSourceWin: Window,
            callback?: FrameMessageResponseCallback,
        ) => {
            this.post(windowSource, command, result, callback, messageId);
        };
    }

    private notifySubscriber(target: Window, data: WindowMessage): void {
        const subscriber = this.messageSubscribers[data.command];
        if (subscriber) {
            subscriber(
                data.message,
                data.error,
                target,
                this.createFrameResponderCallback(target, data.command, data.messageId),
            );
        }
    }
}
