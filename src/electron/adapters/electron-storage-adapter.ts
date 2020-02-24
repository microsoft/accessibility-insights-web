// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';

export class ElectronStorageAdapter implements StorageAdapter {
    constructor(private readonly indexedDBInstance: IndexedDBAPI) {}

    public async setUserData(items: Object): Promise<void> {
        const keys = Object.keys(items);

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            await this.indexedDBInstance.setItem(key, items[key]);
        }
    }

    public async getUserData(keys: string[]): Promise<{ [key: string]: any }> {
        const result = {};

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const value = await this.indexedDBInstance.getItem(key);

            if (value != null) {
                result[key] = value;
            }
        }

        return result;
    }

    public async removeUserData(key: string): Promise<void> {
        await this.indexedDBInstance.removeItem(key);
    }
}
