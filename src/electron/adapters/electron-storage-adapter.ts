// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { pick } from 'lodash';

import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';

export class ElectronStorageAdapter implements StorageAdapter {
    constructor(private readonly indexedDBInstance: IndexedDBAPI) {}

    public async setUserData(items: Object): Promise<void> {
        await this.indexedDBInstance.setItem(IndexedDBDataKeys.installation, items);
    }

    public async getUserData(keys: string[]): Promise<{ [key: string]: any }> {
        const data = await this.indexedDBInstance.getItem(IndexedDBDataKeys.installation);
        return pick(data, keys);
    }

    public async removeUserData(key: string): Promise<void> {
        const data = await this.indexedDBInstance.getItem(IndexedDBDataKeys.installation);
        const filtered = Object.keys(data)
            .filter(internalKey => internalKey !== key)
            .reduce((obj, k) => {
                obj[k] = data[k];
                return obj;
            }, {});
        await this.indexedDBInstance.setItem(IndexedDBDataKeys.installation, filtered);
    }
}
