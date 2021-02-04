// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createStore, UseStore as IndexedDBStore } from 'idb-keyval';

enum IndexedDBConstants {
    defaultIndexedDBName = 'default-db',
    defaultIndexedDBStoreName = 'default-store',
}

export const getIndexedDBStore: () => IndexedDBStore = () => {
    const store = createStore(
        IndexedDBConstants.defaultIndexedDBName,
        IndexedDBConstants.defaultIndexedDBStoreName,
    );
    return store;
};
