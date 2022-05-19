// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../base-store';

export interface ClientStoresHub<T> {
    stores: BaseStore<any>[];
    addChangedListenerToAllStores(listener: () => void): void;
    removeChangedListenerFromAllStores(listener: () => void): void;
    hasStores(): boolean;
    hasStoreData(): boolean;
    getAllStoreData(): Partial<T> | null;
}
