// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BrowserMessageHandler } from 'common/browser-adapters/browser-message-distributor';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { DevToolsStatusRequest, DevToolsStatusResponse } from 'common/types/dev-tools-messages';

export class DevToolsStatusResponder {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public handleBrowserMessage: BrowserMessageHandler = (
        message: Message,
    ): void | Promise<DevToolsStatusResponse> => {
        if (this.isStatusRequestForTab(message)) {
            // Must return a promise for the response to send correctly
            return Promise.resolve({ isActive: true });
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
