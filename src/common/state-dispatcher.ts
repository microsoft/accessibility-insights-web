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

    public async initialize(): Promise<void> {
        const promises = this.stores
            .getAllStores()
            .map(store => this.addDispatchListenerToStore(store));
        await Promise.all(promises);
    }

    private async addDispatchListenerToStore(store: BaseStore<any, Promise<void>>): Promise<void> {
        const dispatchStateUpdateDelegate = this.getDispatchStateUpdateEvent(store);
        store.addChangedListener(dispatchStateUpdateDelegate);
        await dispatchStateUpdateDelegate();
    }

    private getDispatchStateUpdateEvent = (
        store: BaseStore<any, Promise<void>>,
    ): (() => Promise<void>) => {
        return async () => {
            await this.broadcastMessage({
                storeId: store.getId(),
                messageType: storeUpdateMessageType,
                storeType: this.stores.getStoreType(),
                payload: store.getState(),
            }).catch(this.logger.error);
        };
    };
}
