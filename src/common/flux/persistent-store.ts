// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { cloneDeep, isEmpty, isEqual, merge } from 'lodash';

export abstract class PersistentStore<TState> extends BaseStoreImpl<TState, Promise<void>> {
    private previouslyPersistedState: TState | null;

    constructor(
        storeName: StoreNames,
        protected readonly persistedState: TState,
        protected readonly idbInstance: IndexedDBAPI,
        protected readonly indexedDBDataKey: string,
        protected readonly logger: Logger,
    ) {
        super(storeName);
        this.previouslyPersistedState = null;
    }

    protected async persistData(storeData: TState): Promise<boolean> {
        if (!isEqual(this.previouslyPersistedState, storeData)) {
            this.previouslyPersistedState = storeData;
            await this.idbInstance.setItem(this.indexedDBDataKey, storeData);
        }
        return true;
    }

    // Allow specific stores to override default state behavior
    protected generateDefaultState(persistedData: TState): TState {
        const defaultState = this.getDefaultState();
        return !isEmpty(persistedData) ? merge({}, defaultState, persistedData) : defaultState;
    }

    public override initialize(initialState?: TState): void {
        const generatedPersistedState = this.generateDefaultState(this.persistedState);

        this.state = initialState || generatedPersistedState;

        this.addActionListeners();
    }

    public async teardown(): Promise<void> {
        await this.idbInstance.removeItem(this.indexedDBDataKey);
        this.previouslyPersistedState = null;
    }

    protected async emitChanged(): Promise<void> {
        if (this.idbInstance && this.logger) {
            const storeData = cloneDeep(this.getState());
            await this.persistData(storeData);
        }

        await super.emitChanged();
    }
}
