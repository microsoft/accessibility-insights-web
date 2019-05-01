// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { each } from 'lodash';

import { StorageAPI } from './browser-adapters/storage-adapter';

export class UserStoredDataCleaner {
    constructor(private readonly storageAdapter?: StorageAPI) {}

    public cleanUserData(userDataKeys: string[], callback?: () => void): void {
        this.storageAdapter.getUserData(userDataKeys, userDataKeysMap => {
            each(userDataKeysMap, (value, key) => {
                this.storageAdapter.removeUserData(key);
            });

            if (callback) {
                callback();
            }
        });
    }
}
