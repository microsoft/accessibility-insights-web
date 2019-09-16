// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getPersistedData, getPersistedUserConfigData, PersistedData } from 'background/get-persisted-data';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { IMock, Mock } from 'typemoq';

import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { AssessmentStoreData, PersistedTabInfo } from '../../../../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';

describe('GetPersistedDataTest', () => {
    let indexedDBInstanceStrictMock: IMock<IndexedDBAPI>;
    let assessmentStoreData: AssessmentStoreData;
    let userConfigurationData: UserConfigurationStoreData;

    beforeEach(() => {
        assessmentStoreData = {
            assessmentNavState: null,
            assessments: null,
            persistedTabInfo: {} as PersistedTabInfo,
            resultDescription: '',
        };
        userConfigurationData = {
            isFirstTime: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };
        indexedDBInstanceStrictMock = Mock.ofType<IndexedDBAPI>();
    });

    it('propagates the results of IndexedDBAPI.getItem for the appropriate keys', async () => {
        indexedDBInstanceStrictMock.setup(i => i.getItem(IndexedDBDataKeys.assessmentStore)).returns(async () => assessmentStoreData);
        indexedDBInstanceStrictMock.setup(i => i.getItem(IndexedDBDataKeys.userConfiguration)).returns(async () => userConfigurationData);

        const data = await getPersistedData(indexedDBInstanceStrictMock.object);

        expect(data).toEqual({
            assessmentStoreData: assessmentStoreData,
            userConfigurationData: userConfigurationData,
        } as PersistedData);
    });

    it('gets only the userconfigData when its called for', async () => {
        indexedDBInstanceStrictMock.setup(i => i.getItem(IndexedDBDataKeys.userConfiguration)).returns(async () => userConfigurationData);
        const data = await getPersistedUserConfigData(indexedDBInstanceStrictMock.object);

        expect(data).toEqual({
            userConfigurationData: userConfigurationData,
        } as Partial<PersistedData>);
    });
});
