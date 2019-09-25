// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { pick } from 'lodash';

import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';
import { createDefaultLogger } from '../../common/logging/default-logger';
import { Logger } from '../../common/logging/logger';

export class ElectronStorageAdapter implements StorageAdapter {
    constructor(private readonly indexedDBInstance: IndexedDBAPI, private logger: Logger = createDefaultLogger()) {}

    public setUserData(items: Object): Promise<void> {
        return new Promise((resolve, reject) => {
            this.indexedDBInstance
                .setItem(IndexedDBDataKeys.installation, items)
                .then(() => resolve())
                .catch(reject);
        });
    }

    public getUserDataP(keys: string[]): Promise<{ [key: string]: any }> {
        return this.indexedDBInstance.getItem(IndexedDBDataKeys.installation).then(data => pick(data, keys));
    }

    public getUserData(keys: string[], callback: (items: { [key: string]: any }) => void): void {
        this.indexedDBInstance
            .getItem(IndexedDBDataKeys.installation)
            .then(data => {
                const filteredData = pick(data, keys);
                callback(filteredData);
            })
            .catch(error => {
                this.logger.error('Error occurred when trying to get user data: ', error);
            });
    }

    public removeUserData(key: string): void {
        this.indexedDBInstance
            .getItem(IndexedDBDataKeys.installation)
            .then(data => {
                const filtered = Object.keys(data)
                    .filter(internalKey => internalKey !== key)
                    .reduce((obj, k) => {
                        obj[key] = data[k];
                        return obj;
                    }, {});
                this.indexedDBInstance.setItem(IndexedDBDataKeys.installation, filtered).catch(e => this.logger.error(e));
            })
            .catch(error => this.logger.error('Error occurred when trying to remove user data: ', error));
    }
}
