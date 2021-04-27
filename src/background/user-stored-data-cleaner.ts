// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { each } from 'lodash';

export const cleanKeysFromStorage = (
    storageAdapter: StorageAdapter,
    userDataKeys: string[],
): Promise<void> => {
    return storageAdapter.getUserData(userDataKeys).then(userDataKeysMap => {
        each(userDataKeysMap, (value, key) => {
            // we don't want to do anything special if removing data fails
            storageAdapter.removeUserData(key).catch(console.error);
        });
    });
};
