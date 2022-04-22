// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from './logging/logger';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage } from './types/store-update-message';

type StoreUpdateMessageListener = (message: StoreUpdateMessage<any>) => void;

export class StoreUpdateMessageDistributor {
    private readonly registeredUpdateListeners: { [key: string]: StoreUpdateMessageListener } = {};

    constructor(
        private readonly tabId: number,
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.handleMessage);
    }

    public dispose(): void {
        this.browserAdapter.removeListenerOnMessage(this.handleMessage);
    }

    public registerStoreUpdateListener(
        storeId: string,
        listener: StoreUpdateMessageListener,
    ): void {
        if (this.registeredUpdateListeners[storeId]) {
            throw new Error(`An update listener for store ${storeId} is already registered`);
        }
        this.registeredUpdateListeners[storeId] = listener;
    }

    private handleMessage = (message: StoreUpdateMessage<any>): void => {
        if (!this.isValidMessage(message)) {
            this.logger.log('Unable to interpret message - ', message);

            return;
        }

        const listener = this.registeredUpdateListeners[message.storeId];
        if (listener) {
            listener(message);
        } else {
            this.logger.log('No listeners registered for message - ', message);
        }
    };

    private isValidMessage(message: StoreUpdateMessage<any>): boolean {
        return (
            message.isStoreUpdateMessage &&
            message.storeId &&
            message.payload &&
            (this.isMessageForCurrentTab(message) || message.storeType === StoreType.GlobalStore)
        );
    }

    private isMessageForCurrentTab(message: StoreUpdateMessage<any>): boolean {
        return (
            this.tabId == null || message.tabId === this.tabId // tabid will be null on inital state in content script of target page
        );
    }
}
