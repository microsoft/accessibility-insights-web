// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getPersistedData, PersistedData } from 'background/get-persisted-data';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { IMock, Mock } from 'typemoq';

import { InstallationData } from '../../../../background/installation-data';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';

describe('GetPersistedDataTest', () => {
    let indexedDBInstanceStrictMock: IMock<IndexedDBAPI>;
    let assessmentStoreData: AssessmentStoreData;
    let userConfigurationData: UserConfigurationStoreData;
    let installationData: InstallationData;

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
            lastSelectedHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
            adbLocation: null,
            lastWindowState: null,
            lastWindowBounds: null,
        };
        installationData = {
            id: 'test-id',
            month: 0,
            year: 0,
        };
        indexedDBInstanceStrictMock = Mock.ofType<IndexedDBAPI>();
    });

    it('propagates the results of IndexedDBAPI.getItem for the appropriate keys', async () => {
        const indexedDataKeysToFetch = [
            IndexedDBDataKeys.assessmentStore,
            IndexedDBDataKeys.userConfiguration,
        ];

        indexedDBInstanceStrictMock
            .setup(i => i.getItem(IndexedDBDataKeys.assessmentStore))
            .returns(async () => assessmentStoreData);
        indexedDBInstanceStrictMock
            .setup(i => i.getItem(IndexedDBDataKeys.userConfiguration))
            .returns(async () => userConfigurationData);

        const data = await getPersistedData(
            indexedDBInstanceStrictMock.object,
            indexedDataKeysToFetch,
        );

        expect(data).toEqual({
            assessmentStoreData: assessmentStoreData,
            userConfigurationData: userConfigurationData,
        } as PersistedData);
    });

    it('uses specified data keys to read persisted data', async () => {
        const indexedDataKeysToFetch = [
            IndexedDBDataKeys.userConfiguration,
            IndexedDBDataKeys.installation,
        ];

        indexedDBInstanceStrictMock
            .setup(i => i.getItem(IndexedDBDataKeys.userConfiguration))
            .returns(async () => userConfigurationData);
        indexedDBInstanceStrictMock
            .setup(i => i.getItem(IndexedDBDataKeys.installation))
            .returns(async () => installationData);

        const data = await getPersistedData(
            indexedDBInstanceStrictMock.object,
            indexedDataKeysToFetch,
        );

        expect(data).toEqual({
            userConfigurationData: userConfigurationData,
            installationData: installationData,
        } as Partial<PersistedData>);
    });
});
