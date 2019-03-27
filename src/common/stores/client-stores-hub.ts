// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IBaseStore } from '../istore';

export interface ClientStoresHub<T> {
    stores: IBaseStore<any>[];
    addChangedListenerToAllStores(listener: () => void): void;
    removeChangedListenerFromAllStores(listener: () => void): void;
    hasStores(): boolean;
    hasStoreData(): boolean;
    getAllStoreData(): T;
}
