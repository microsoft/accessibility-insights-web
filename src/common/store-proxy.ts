// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEqual } from 'lodash';

import { BaseStore } from './base-store';
import { BrowserAdapter } from './browser-adapters/browser-adapter';
import { GenericStoreMessageTypes } from './constants/generic-store-messages-types';
import { Store } from './flux/store';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage } from './types/store-update-message';

export class StoreProxy<TState> extends Store implements BaseStore<TState> {
    private state: TState;
    private storeId: string;
    private tabId?: number;
    private browserAdapter: BrowserAdapter;

    constructor(storeId: string, browserAdapter: BrowserAdapter, tabId?: number) {
        super();
        this.storeId = storeId;
        this.browserAdapter = browserAdapter;
        this.tabId = tabId;
        this.browserAdapter.addListenerOnMessage(this.onChange);
    }

    private onChange = (message: StoreUpdateMessage<TState>): void => {
        if (!this.isValidMessage(message)) {
            return;
        }

        if (
            message.messageType === GenericStoreMessageTypes.storeStateChanged &&
            !isEqual(this.state, message.payload)
        ) {
            this.state = message.payload;
            this.emitChanged();
        }
    };

    private isValidMessage(message: StoreUpdateMessage<TState>): boolean {
        return (
            message.isStoreUpdateMessage &&
            this.isMessageForCurrentStore(message) &&
            (this.isMessageForCurrentTab(message) || message.storeType === StoreType.GlobalStore)
        );
    }

    private isMessageForCurrentTab(message: StoreUpdateMessage<TState>): boolean {
        return (
            this.tabId == null || message.tabId === this.tabId // tabid will be null on inital state in content script of target page
        );
    }

    private isMessageForCurrentStore(message: StoreUpdateMessage<TState>): boolean {
        return message.payload && message.storeId === this.getId();
    }

    public getState = (): TState => {
        return this.state;
    };

    public getId(): string {
        return this.storeId;
    }

    public dispose(): void {
        this.browserAdapter.removeListenerOnMessage(this.onChange);
    }
}
