// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';
import { createDefaultLogger } from '../../common/logging/default-logger';
import { Logger } from '../../common/logging/logger';

export class ElectronStorageAdapter implements StorageAdapter {
    constructor(private readonly indexedDBInstance: IndexedDBAPI, private logger: Logger = createDefaultLogger()) {}

    public setUserData(items: Object, callback?: () => void): void {
        this.indexedDBInstance
            .setItem(IndexedDBDataKeys.installation, items)
            .then(() => callback)
            .catch(error => {
                this.logger.error('Error occured when trying to set user data:', error);
            });
    }

    public getUserData(keys: string | Object | string[], callback: (items: { [key: string]: any }) => void): void {
        this.indexedDBInstance
            .getItem(IndexedDBDataKeys.installation)
            .then(data => callback(data))
            .catch(error => {
                this.logger.error('Error occured when trying to get user data:', error);
            });
    }

    public removeUserData(key: string): void {
        this.indexedDBInstance
            .removeItem(IndexedDBDataKeys.installation)
            .catch(error => this.logger.error('Error removing user data', error));
    }
}
