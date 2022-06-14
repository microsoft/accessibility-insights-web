// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Runtime } from 'webextension-polyfill';
import { BrowserMessageHandler, BrowserMessageResponse } from './browser-message-handler';

export class BrowserMessageDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly messageHandlers: BrowserMessageHandler[],
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnRuntimeMessage(this.distributeMessage);
    }

    private distributeMessage: BrowserMessageHandler = (
        message: any,
        sender: Runtime.MessageSender,
    ): BrowserMessageResponse => {
        for (const handler of this.messageHandlers) {
            const response = handler(message, sender);
            if (response.messageHandled) {
                return response;
            }
        }

        return { messageHandled: false };
    };
}
