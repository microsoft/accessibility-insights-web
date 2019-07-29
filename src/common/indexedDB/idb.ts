// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// reference: https://github.com/jakearchibald/idb-keyval/blob/master/idb-keyval.ts
// uglifyjs has an issue which prevents us from using the `idb-keyval` npm package with uglifyjs
// https://github.com/jakearchibald/idb-keyval/issues/51
// using this code till that issue is fixed

export class Store {
    // keeping naming consistent with original external source
    // tslint:disable-next-line: variable-name
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

    public _withIDBStore(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => void): Promise<void> {
        return this._dbp.then(
            db =>
                new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(this.storeName, mode);
                    transaction.oncomplete = () => resolve();
                    transaction.onabort = transaction.onerror = () => reject(transaction.error);
                    callback(transaction.objectStore(this.storeName));
                }),
        );
    }
}

type IDBResultTarget = {
    result: IDBValidKey[];
} & EventTarget;

type IDBEvent = {
    target: IDBResultTarget;
} & Event;

let store: Store;

function getDefaultStore(): Store {
    if (!store) {
        store = new Store();
    }
    return store;
}

// tslint:disable-next-line: no-reserved-keywords
export function get<Type>(key: IDBValidKey, defaultStore = getDefaultStore()): Promise<Type> {
    let req: IDBRequest;
    return defaultStore
        ._withIDBStore('readonly', (s: IDBObjectStore) => {
            req = s.get(key);
        })
        .then(() => req.result);
}

// tslint:disable-next-line: no-reserved-keywords
export function set<Type>(key: IDBValidKey, value: Type, defaultStore = getDefaultStore()): Promise<void> {
    return defaultStore._withIDBStore('readwrite', (s: IDBObjectStore) => {
        s.put(value, key);
    });
}

export function del(key: IDBValidKey, defaultStore = getDefaultStore()): Promise<void> {
    return defaultStore._withIDBStore('readwrite', (s: IDBObjectStore) => {
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
