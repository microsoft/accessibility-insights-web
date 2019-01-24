// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import '../../background/string-utils';

import * as _ from 'lodash/index';

import { IBaseStore } from '../../common/istore';
import { IClientStoresHub } from './iclient-stores-hub';

export class BaseClientStoresHub<T> implements IClientStoresHub<T> {
    public stores: IBaseStore<any>[];

    constructor(stores: IBaseStore<any>[]) {
        this.stores = stores;
    }

    public addChangedListenerToAllStores(listener: () => void): void {
        if (!this.stores) {
            return;
        }

        this.stores.forEach(store => {
            store.addChangedListener(listener);
        });
    }

    public removeChangedListenerFromAllStores(listener: () => void): void {
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

        return _.every(this.stores, store => store != null);
    }

    public hasStoreData(): boolean {
        return this.stores.every(store => {
            return store != null && store.getState() != null;
        });
    }

    public getAllStoreData(): T {
        if (!this.hasStores()) {
            return null;
        }

        const state: Partial<T> = this.stores.reduce(
            (builtState: Partial<T>, store) => {
                const key = `${_.lowerFirst(store.getId())}Data`;
                builtState[key as keyof T] = store.getState();
                return builtState;
            },
            {} as Partial<T>,
        );
        return state as T;
    }
}
