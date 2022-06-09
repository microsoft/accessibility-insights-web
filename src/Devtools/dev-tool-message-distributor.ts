// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { DevToolsStatusRequest, DevToolsStatusResponse } from 'common/types/dev-tools-messages';
import { StoreUpdateMessage } from 'common/types/store-update-message';

export class DevToolsMessageDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly storeUpdateHub: StoreUpdateMessageHub,
    ) {}

    public initialize() {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (
        message: Message,
    ): void | Promise<void> | Promise<DevToolsStatusResponse> => {
        if (this.isStatusRequestForTab(message)) {
            // Must return a promise for the response to send correctly
            return Promise.resolve({ isActive: true });
        } else {
            return this.storeUpdateHub.handleMessage(message as StoreUpdateMessage<unknown>);
        }
    };

    private isStatusRequestForTab(message: Message): boolean {
        return (
            message.messageType === Messages.DevTools.StatusRequest &&
            (message as DevToolsStatusRequest).tabId ===
                this.browserAdapter.getInspectedWindowTabId()
        );
    }
}
