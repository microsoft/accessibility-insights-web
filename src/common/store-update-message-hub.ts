// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserMessageResponse } from 'common/browser-adapters/browser-message-handler';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { getStoreStateMessage } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import _ from 'lodash';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage, storeUpdateMessageType } from './types/store-update-message';

type StoreUpdateMessageListener = (message: StoreUpdateMessage<any>) => Promise<void>;

export class StoreUpdateMessageHub {
    private browserMessageHandlerUsed: boolean = false;
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
        if (!this.browserMessageHandlerUsed) {
            throw new Error(
                'StoreUpdateMessageHub.browserMessageHandler must be registered as a browser listener *before* registering individual store update listeners to avoid missing store state initialization messages',
            );
        }
        if (this.registeredUpdateListeners[storeId]) {
            throw new Error(`An update listener for store ${storeId} is already registered`);
        }
        this.registeredUpdateListeners[storeId] = listener;

        const message = getStoreStateMessage(StoreNames[storeId]);
        this.dispatcher.dispatchType(message);
    }

    public get handleBrowserMessage(): (message: any) => BrowserMessageResponse {
        this.browserMessageHandlerUsed = true;
        return this.handleBrowserMessageImpl;
    }

    private readonly handleBrowserMessageImpl = (
        message: StoreUpdateMessage<any>,
    ): BrowserMessageResponse => {
        if (!this.isValidMessage(message)) {
            return { messageHandled: false };
        }

        const listener = this.registeredUpdateListeners[message.storeId];
        if (listener) {
            const result = listener(message);
            return { messageHandled: true, result };
        }

        return { messageHandled: false };
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
