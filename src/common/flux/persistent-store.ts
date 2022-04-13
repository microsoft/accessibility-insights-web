// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';

export abstract class PersistentStore<TState> extends BaseStoreImpl<TState> {
    constructor(
        storeName: StoreNames,
        protected readonly persistedState: TState,
        protected readonly idbInstance: IndexedDBAPI,
        protected readonly indexedDBDataKey: string,
        protected readonly logger: Logger,
    ) {
        super(storeName);
    }

    protected async persistData(storeData: any): Promise<boolean> {
        return await this.idbInstance.setItem(this.indexedDBDataKey, storeData);
    }

    public getDefaultState(): TState {
        return this.generateDefaultState(this.persistedState);
    }

    // Allow specific stores to override default state behavior
    protected generateDefaultState(persistedData: TState): TState {
        return persistedData;
    }

    protected emitChanged(): void {
        const storeData = this.getState();

        if (this.idbInstance && this.logger) {
            this.persistData(storeData).catch(this.logger.error);
        }

        super.emitChanged();
    }
}
