// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { each } from 'lodash';

import { StorageAdapter } from '../common/browser-adapters/storage-adapter';

export const cleanKeysFromStorage = (storageAdapter: StorageAdapter, userDataKeys: string[]): Promise<void> => {
    return storageAdapter.getUserData(userDataKeys).then(userDataKeysMap => {
        each(userDataKeysMap, (value, key) => {
            storageAdapter.removeUserData(key);
        });
    });
};
