// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cleanKeysFromStorage } from 'background/user-stored-data-cleaner';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { StorageAdapter } from '../../../../common/browser-adapters/storage-adapter';

describe('cleanKeysFromStorage', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    const testObject = cleanKeysFromStorage;

    beforeEach(() => {
        storageAdapterMock = Mock.ofType<StorageAdapter>(undefined, MockBehavior.Strict);
    });

    it('removes keys properly', async () => {
        const keys = ['exist', 'does-not-exist'];
        const data = {
            exist: 'yes it does',
        };

        storageAdapterMock.setup(storage => storage.getUserData(keys)).returns(() => Promise.resolve(data));
        storageAdapterMock.setup(storage => storage.removeUserData('exist')).returns(() => Promise.resolve());

        await testObject(storageAdapterMock.object, keys);
    });
});
