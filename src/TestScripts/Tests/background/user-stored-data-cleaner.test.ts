// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { isFunction } from 'lodash';

import { ChromeAdapter } from '../../../background/browser-adapter';
import { UserStoredDataCleaner } from '../../../background/user-stored-data-cleaner';

describe('UserStoredDataCleanerTest', () => {
    let browserAdapterMock: IMock<ChromeAdapter>;
    let testObject: UserStoredDataCleaner;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType(ChromeAdapter);
        testObject = new UserStoredDataCleaner(browserAdapterMock.object);
    });


    test('remove alias when it exists', async done => {
        const userData: string[] = ['alias'];
        const userDataRes = { alias: 'userAlias' };

        browserAdapterMock
            .setup(mB => mB.getUserData(It.isValue(userData),
                It.is(isFunction)))
            .callback((data, cb) => {
                cb(userDataRes);
            })
            .verifiable(Times.once());

        browserAdapterMock
            .setup(adapter => adapter.removeUserData('alias'))
            .verifiable(Times.once());

        testObject.cleanUserData(userData, () => {
            browserAdapterMock.verifyAll();

            done();
        });
    });
});
