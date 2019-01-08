// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { getPersistedData, PersistedData } from '../../../../background/get-persisted-data';
import { IndexedDBDataKeys } from '../../../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';

describe('GetPersistedDataTest', () => {
    let indexedDBInstanceStrictMock: IMock<IndexedDBAPI>;
    let assessmentStoreData: IAssessmentStoreData;
    let userConfigurationData: UserConfigurationStoreData;
    let assessmentStoreDataPromise = new Promise(() => assessmentStoreData);
    let userConfigurationDataPromise = new Promise(() => userConfigurationData);

    beforeEach(() => {
        assessmentStoreData = { assessmentNavState: null, assessments: null, targetTab: 1 };
        userConfigurationData = { isFirstTime: true, enableTelemetry: false };
        indexedDBInstanceStrictMock = Mock.ofType<IndexedDBAPI>();
        assessmentStoreDataPromise = new Promise(resolve =>  {
            resolve(assessmentStoreData);
        });
        userConfigurationDataPromise = new Promise(resolve =>  {
            resolve(userConfigurationData);
        });
    });

    test('verify returns promise', done => {
        indexedDBInstanceStrictMock.setup(i => i.getItem(IndexedDBDataKeys.assessmentStore)).returns(() => assessmentStoreDataPromise);
        indexedDBInstanceStrictMock.setup(i => i.getItem(IndexedDBDataKeys.userConfiguration)).returns(() => userConfigurationDataPromise);

        getPersistedData(indexedDBInstanceStrictMock.object).then(data => {
            expect(data).toEqual(
                {
                    assessmentStoreData: assessmentStoreData,
                    userConfigurationData: userConfigurationData,
                } as PersistedData);
                done();
        });
    });

});
