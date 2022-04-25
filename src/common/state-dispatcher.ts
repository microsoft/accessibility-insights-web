// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreHub } from 'background/stores/store-hub';
import { Logger } from 'common/logging/logger';
import { BaseStore } from './base-store';
import { StoreUpdateMessage, storeUpdateMessageType } from './types/store-update-message';

export class StateDispatcher {
    constructor(
        private readonly broadcastMessage: (message: StoreUpdateMessage<any>) => Promise<void>,
        private readonly stores: StoreHub,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.stores.getAllStores().forEach(store => this.addDispatchListenerToStore(store));
    }

    private addDispatchListenerToStore(store: BaseStore<any>): void {
        const dispatchStateUpdateDelegate = this.getDispatchStateUpdateEvent(store);
        store.addChangedListener(dispatchStateUpdateDelegate);
        dispatchStateUpdateDelegate();
    }

    private getDispatchStateUpdateEvent = (store: BaseStore<any>): (() => void) => {
        return () => {
            this.broadcastMessage({
                storeId: store.getId(),
                messageType: storeUpdateMessageType,
                storeType: this.stores.getStoreType(),
                payload: store.getState(),
            }).catch(this.logger.error);
        };
    };
}
