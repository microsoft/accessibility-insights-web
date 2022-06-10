// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { OptionalMessageResponse } from 'common/browser-adapters/browser-adapter';
import _ from 'lodash';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage, storeUpdateMessageType } from './types/store-update-message';

type StoreUpdateMessageListener = (message: StoreUpdateMessage<any>) => void | Promise<void>;

export class StoreUpdateMessageHub {
    private readonly registeredUpdateListeners: { [key: string]: StoreUpdateMessageListener } = {};

    constructor(private readonly tabId?: number) {}

    public registerStoreUpdateListener(
        storeId: string,
        listener: StoreUpdateMessageListener,
    ): void {
        if (this.registeredUpdateListeners[storeId]) {
            throw new Error(`An update listener for store ${storeId} is already registered`);
        }
        this.registeredUpdateListeners[storeId] = listener;
    }

    public readonly handleMessage = (message: StoreUpdateMessage<any>): OptionalMessageResponse => {
        if (!this.isValidMessage(message)) {
            return { messageResponse: undefined };
        }

        const listener = this.registeredUpdateListeners[message.storeId];
        if (listener) {
            return { messageResponse: listener(message) };
        }
        return { messageResponse: undefined };
    };

    private isValidMessage(message: StoreUpdateMessage<any>): boolean {
        return (
            message.messageType === storeUpdateMessageType &&
            message.storeId &&
            message.payload &&
            (this.isMessageForCurrentTab(message) || message.storeType === StoreType.GlobalStore)
        );
    }

    private isMessageForCurrentTab(message: StoreUpdateMessage<any>): boolean {
        return _.isNil(this.tabId) || message.tabId === this.tabId;
    }
}
