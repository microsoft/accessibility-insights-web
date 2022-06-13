// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { getStoreStateMessage } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import _ from 'lodash';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage, storeUpdateMessageType } from './types/store-update-message';

type StoreUpdateMessageListener = (message: StoreUpdateMessage<any>) => void | Promise<void>;

export class StoreUpdateMessageHub {
    private readonly registeredUpdateListeners: { [storeId: string]: StoreUpdateMessageListener } =
        {};

    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly tabId?: number,
    ) {}

    public registerStoreUpdateListener(
        storeId: string,
        listener: StoreUpdateMessageListener,
    ): void {
        if (this.registeredUpdateListeners[storeId]) {
            throw new Error(`An update listener for store ${storeId} is already registered`);
        }
        this.registeredUpdateListeners[storeId] = listener;

        const message = getStoreStateMessage(StoreNames[storeId]);
        this.dispatcher.dispatchType(message);
    }

    public readonly handleBrowserMessage = (
        message: StoreUpdateMessage<any>,
    ): void | Promise<void> => {
        if (!this.isValidMessage(message)) {
            return;
        }

        const listener = this.registeredUpdateListeners[message.storeId];
        if (listener) {
            return listener(message);
        }
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
