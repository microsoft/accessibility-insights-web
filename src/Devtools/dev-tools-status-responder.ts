// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { DevToolsStatusRequest } from 'common/types/dev-tools-messages';

export class DevToolsStatusResponder {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public handleBrowserMessage = (message: Message): BrowserMessageResponse => {
        if (this.isStatusRequestForTab(message)) {
            return {
                messageHandled: true,
                result: Promise.resolve({ isActive: true }),
            };
        }

        return { messageHandled: false };
    };

    private isStatusRequestForTab(message: Message): boolean {
        return (
            message.messageType === Messages.DevTools.StatusRequest &&
            (message as DevToolsStatusRequest).tabId ===
                this.browserAdapter.getInspectedWindowTabId()
        );
    }
}
