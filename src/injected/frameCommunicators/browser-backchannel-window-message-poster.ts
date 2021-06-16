// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

import { WindowUtils } from 'common/window-utils';

import { BackchannelWindowMessageTranslator } from './backchannel-window-message-translator';

export type WindowMessageListener = (receivedMessage: any, sourceWindow: Window) => void;

export interface WindowMessagePoster {
    postMessage(win: Window, message: any): void;
    addMessageListener(listener: WindowMessageListener): void;
    dispose(): void;
}

// BrowserBackchannelWindowMessagePoster is responsible for:
// * keeping a list of WindowMessageListeners
// * using a BackchannelWindowMessageTranslator to parse and create messages
// * providing postMessage method that sends metadata to the Window and a store request to the backchannel
// * attaching an event listener to the Window that:
//      * sends requests to the backchannel (background script)
//      * sends responses to registered listeners

// receivedMessage here will be identical to what the other frame passes as the "message" parameter
// to postMessage
export class BrowserBackchannelWindowMessagePoster implements WindowMessagePoster {
    private listeners: WindowMessageListener[] = [];

    constructor(
        private readonly windowUtils: WindowUtils,
        private readonly browserAdapter: BrowserAdapter,
        private readonly backchannelWindowMessageTranslator: BackchannelWindowMessageTranslator,
    ) {}

    public initialize() {
        this.windowUtils.addEventListener(window, 'message', this.onWindowMessageEvent, false);
    }

    public postMessage(win: Window, message: any): void {
        const { windowMessageMetadata: windowMessage, backchannelMessage } =
            this.backchannelWindowMessageTranslator.splitWindowMessage(message);

        this.browserAdapter.sendRuntimeMessage(backchannelMessage);
        this.windowUtils.postMessage(win, windowMessage, '*');
    }

    public addMessageListener(listener: WindowMessageListener): void {
        this.listeners.push(listener);
    }

    public dispose(): void {
        this.windowUtils.removeEventListener(window, 'message', this.onWindowMessageEvent, false);
    }

    // The received message only contains an opaque ID. This callback uses that ID to ask the
    // background page (our "backchannel") what the true message content is, then forwards the
    // true content along to the previously-added listeners.
    private onWindowMessageEvent = async (windowMessageEvent: MessageEvent<any>): Promise<void> => {
        // We know that source is a Window because we only register this handler via
        // window.addEventListener
        const windowSource = windowMessageEvent.source as Window;

        const backchannelRetrieveMessage =
            this.backchannelWindowMessageTranslator.tryCreateBackchannelReceiveMessage(
                windowMessageEvent.data,
            );
        if (backchannelRetrieveMessage == null) {
            return; // the window message wasn't ours, so we ignore it
        }

        let rawBackchannelResponse: any;
        try {
            rawBackchannelResponse = await this.browserAdapter.sendRuntimeMessage(
                backchannelRetrieveMessage,
            );
        } catch (e) {
            if (e.message === 'Could not find content for specified token') {
                return; // This is most likely caused by a page replaying our messages
            } else {
                throw e;
            }
        }

        const responseMessage =
            this.backchannelWindowMessageTranslator.tryParseBackchannelRetrieveResponseMessage(
                rawBackchannelResponse,
            );
        if (responseMessage !== null) {
            const synthesizedMessage = JSON.parse(responseMessage.stringifiedMessageData);
            this.listeners.forEach(listener => {
                listener(synthesizedMessage, windowSource);
            });
        }
    };
}
