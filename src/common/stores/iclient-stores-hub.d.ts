// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStore } from '../istore';

// tslint:disable-next-line:interface-name
export interface IClientStoresHub<T> {
    stores: BaseStore<any>[];
    addChangedListenerToAllStores(listener: () => void): void;
    removeChangedListenerFromAllStores(listener: () => void): void;
    hasStores(): boolean;
    hasStoreData(): boolean;
    getAllStoreData(): T;
}
