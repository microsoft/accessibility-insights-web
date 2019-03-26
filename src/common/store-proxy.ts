// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as _ from 'lodash';

import { ClientChromeAdapter } from './client-browser-adapter';
import { GenericStoreMessageTypes } from './constants/generic-store-messages-types';
import { Store } from './flux/store';
import { BaseStore } from './istore';
import { StoreType } from './types/store-type';
import { StoreUpdateMessage } from './types/store-update-message';

export class StoreProxy<TState> extends Store implements BaseStore<TState> {
    private _state: TState;
    private _storeId: string;
    private _tabId: number;
    private _clientChomeAdapter: ClientChromeAdapter;

    constructor(storeId: string, chromeAdapter: ClientChromeAdapter) {
        super();
        this._storeId = storeId;
        this._clientChomeAdapter = chromeAdapter;
        this._clientChomeAdapter.addListenerOnMessage(this.onChange);
    }

    @autobind
    private onChange(message: StoreUpdateMessage<TState>): void {
        if (!this.isValidMessage(message)) {
            return;
        }

        if (message.type === GenericStoreMessageTypes.storeStateChanged && !_.isEqual(this._state, message.payload)) {
            this._state = message.payload;
            this.emitChanged();
        }
    }

    private isValidMessage(message: StoreUpdateMessage<TState>): boolean {
        return (
            message.isStoreUpdateMessage &&
            this.isMessageForCurrentStore(message) &&
            (this.isMessageForCurrentTab(message) || message.storeType === StoreType.GlobalStore)
        );
    }

    private isMessageForCurrentTab(message: StoreUpdateMessage<TState>): boolean {
        return (
            this._tabId == null || message.tabId === this._tabId // tabid will be null on inital state in content script of target page
        );
    }

    private isMessageForCurrentStore(message: StoreUpdateMessage<TState>): boolean {
        return message.payload && message.storeId === this.getId();
    }

    @autobind
    public getState(): TState {
        return this._state;
    }

    public getId(): string {
        return this._storeId;
    }

    public setTabId(tabId: number): void {
        this._tabId = tabId;
    }

    public dispose(): void {
        this._clientChomeAdapter.removeListenerOnMessage(this.onChange);
    }
}
