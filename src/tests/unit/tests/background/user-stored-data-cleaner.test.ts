// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cleanKeysFromStorage } from 'background/user-stored-data-cleaner';
import { IMock, Mock, Times } from 'typemoq';

import { StorageAdapter } from '../../../../common/browser-adapters/storage-adapter';

describe('cleanKeysFromStorage', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    const testObject = cleanKeysFromStorage;

    beforeEach(() => {
        storageAdapterMock = Mock.ofType<StorageAdapter>();
    });

    it('removes keys properly', async () => {
        const keys = ['exist', 'does-not-exist'];
        const data = {
            exist: 'yes it does',
        };

        storageAdapterMock.setup(storage => storage.getUserDataP(keys)).returns(() => Promise.resolve(data));

        await testObject(storageAdapterMock.object, keys);

        storageAdapterMock.verify(storage => storage.removeUserData('exist'), Times.once());
    });
});
