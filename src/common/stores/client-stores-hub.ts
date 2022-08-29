// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { every, lowerFirst } from 'lodash';
import { BaseStore } from '../base-store';

export class ClientStoresHub<T> {
    public stores: BaseStore<any, Promise<void>>[];

    constructor(stores: BaseStore<any, Promise<void>>[]) {
        this.stores = stores;
    }

    public addChangedListenerToAllStores(listener: () => Promise<void>): void {
        if (!this.stores) {
            return;
        }

        this.stores.forEach(store => {
            store.addChangedListener(listener);
        });
    }

    public removeChangedListenerFromAllStores(listener: () => Promise<void>): void {
        if (!this.stores) {
            return;
        }

        this.stores.forEach(store => {
            store.removeChangedListener(listener);
        });
    }

    public hasStores(): boolean {
        if (!this.stores) {
            return false;
        }

        return every(this.stores, store => store != null);
    }

    public hasStoreData(): boolean {
        return this.stores.every(store => {
            return store != null && store.getState() != null;
        });
    }

    public getAllStoreData(): Partial<T> | null {
        if (!this.hasStores()) {
            return null;
        }

        return this.stores.reduce((builtState: Partial<T>, store) => {
            const key = `${lowerFirst(store.getId())}Data`;
            builtState[key as keyof T] = store.getState();
            return builtState;
        }, {} as Partial<T>);
    }
}
