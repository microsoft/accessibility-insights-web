// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { StoreHub } from '../background/stores/istore-hub';
import { GenericStoreMessageTypes } from './constants/generic-store-messages-types';
import { IBaseStore } from './istore';
import { StoreUpdateMessage } from './types/store-update-message';

export class StateDispatcher {
    private broadcastMessage: (message: StoreUpdateMessage<any>) => void;
    private stores: StoreHub;

    constructor(broadcastMessage: (message: Object) => void, stores: StoreHub) {
        this.broadcastMessage = broadcastMessage;
        this.stores = stores;
    }

    public initialize(): void {
        this.stores.getAllStores().forEach(store => this.addDispatchListenerToStore(store));
    }

    private addDispatchListenerToStore(store: IBaseStore<any>): void {
        const dispatchStateUpdateDelegate = this.getDispatchStateUpdateEvent(store);
        store.addChangedListener(dispatchStateUpdateDelegate);
        dispatchStateUpdateDelegate();
    }

    @autobind
    private getDispatchStateUpdateEvent(store: IBaseStore<any>): () => void {
        return () => {
            this.broadcastMessage({
                isStoreUpdateMessage: true,
                storeId: store.getId(),
                type: GenericStoreMessageTypes.storeStateChanged,
                storeType: this.stores.getStoreType(),
                payload: store.getState(),
            });
        };
    }
}
