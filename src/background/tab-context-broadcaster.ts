// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { StoreUpdateMessage } from '../common/types/store-update-message';

export class TabContextBroadcaster {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger = createDefaultLogger(),
    ) {}

    public getBroadcastMessageDelegate = (
        tabId,
    ): ((message: StoreUpdateMessage<any>) => Promise<void>) => {
        return async message => {
            message.tabId = tabId;
            await Promise.all([
                this.browserAdapter.sendMessageToFrames(message).catch(this.logger.error),
                this.browserAdapter.sendMessageToTab(tabId, message).catch(this.logger.error),
            ]);
        };
    };
}
