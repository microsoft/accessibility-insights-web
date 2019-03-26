// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type IDBResultTarget = {
    result: IDBValidKey[];
} & EventTarget;

type IDBEvent = {
    target: IDBResultTarget;
} & Event;

interface IndexedDBObjectStore extends IDBObjectStore {
    openKeyCursor(range?: IDBKeyRange | IDBValidKey, direction?: IDBCursorDirection): IDBRequest;
}
export class Store {
    public readonly _dbp: Promise<IDBDatabase>;

    constructor(dbName = 'default-db', readonly storeName = 'default-store') {
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);

            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }

    public _withIDBStore(type: IDBTransactionMode, callback: (store: IndexedDBObjectStore | IDBObjectStore) => void): Promise<void> {
        return this._dbp.then(
            db =>
                new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(this.storeName, type);
                    transaction.oncomplete = () => resolve();
                    transaction.onabort = transaction.onerror = () => reject(transaction.error);
                    callback(transaction.objectStore(this.storeName));
                }),
        );
    }
}

let store: Store;

function getDefaultStore(): Store {
    if (!store) {
        store = new Store();
    }
    return store;
}

export function get<Type>(key: IDBValidKey, defaultStore = getDefaultStore()): Promise<Type> {
    let req: IDBRequest;
    return defaultStore
        ._withIDBStore('readonly', (s: IndexedDBObjectStore) => {
            req = s.get(key);
        })
        .then(() => req.result);
}

export function set<Type>(key: IDBValidKey, value: Type, defaultStore = getDefaultStore()): Promise<void> {
    return defaultStore._withIDBStore('readwrite', (s: IndexedDBObjectStore) => {
        s.put(value, key);
    });
}

export function del(key: IDBValidKey, defaultStore = getDefaultStore()): Promise<void> {
    return defaultStore._withIDBStore('readwrite', (s: IndexedDBObjectStore) => {
        s.delete(key);
    });
}

export function keys(defaultStore = getDefaultStore()): Promise<IDBValidKey[]> {
    let keyArray: IDBValidKey[] = [];

    return defaultStore
        ._withIDBStore('readonly', (s: any) => {
            s.getAllKeys().onsuccess = function(event: IDBEvent): void {
                keyArray = event.target.result;
            };
        })
        .then(() => keyArray);
}
