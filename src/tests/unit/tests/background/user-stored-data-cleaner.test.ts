// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { UserStoredDataCleaner } from 'background/user-stored-data-cleaner';
import { StorageAdapter } from '../../../../common/browser-adapters/storage-adapter';

describe('UserStoredDataCleanerTest', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    let testObject: UserStoredDataCleaner;

    beforeEach(() => {
        storageAdapterMock = Mock.ofType<StorageAdapter>();
        testObject = new UserStoredDataCleaner(storageAdapterMock.object);
    });

    test('remove alias when it exists', async done => {
        const userData: string[] = ['alias'];
        const userDataRes = { alias: 'userAlias' };

        storageAdapterMock.setup(adapter => adapter.getUserData(userData, It.is(isFunction))).callback((data, cb) => cb(userDataRes));

        testObject.cleanUserData(userData, () => {
            storageAdapterMock.verify(adapter => adapter.removeUserData('alias'), Times.once());

            done();
        });
    });
});
