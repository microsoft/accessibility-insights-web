// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';

export class ElectronStorageAdapter implements StorageAdapter {
    constructor(private readonly indexedDBInstance: IndexedDBAPI) {}
    public setUserData(items: Object, callback?: () => void): void {
        // tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
        this.indexedDBInstance.setItem(IndexedDBDataKeys.installation, items).then(() => callback);
    }
    public getUserData(keys: string | Object | string[], callback: (items: { [key: string]: any }) => void): void {
        // tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
        this.indexedDBInstance.getItem(IndexedDBDataKeys.installation).then(data => {
            return callback(data);
        });
    }
    public removeUserData(key: string): void {
        // tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
        this.indexedDBInstance.removeItem(IndexedDBDataKeys.installation);
    }
}
