// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { StoreUpdateMessage } from '../common/types/store-update-message';

export class TabContextBroadcaster {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public getBroadcastMessageDelegate = (
        tabId,
    ): ((message: StoreUpdateMessage<any>) => void) => {
        return message => {
            message.tabId = tabId;
            this.browserAdapter.sendMessageToFrames(message);
            this.browserAdapter.sendMessageToTab(tabId, message);
        };
    };
}
