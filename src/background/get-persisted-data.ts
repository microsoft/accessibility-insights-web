// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { IAssessmentStoreData } from '../common/types/store-data/iassessment-result-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';

export interface PersistedData {
    assessmentStoreData: IAssessmentStoreData;
    userConfigurationData: UserConfigurationStoreData;
}
export function getPersistedData(indexedDBInstance: IndexedDBAPI): Promise<PersistedData> {
    const persistedData = {} as PersistedData;

    const promises: Array<Promise<any>> = [];

    promises.push(
        indexedDBInstance.getItem(IndexedDBDataKeys.assessmentStore).then(assessmentData => {
            persistedData.assessmentStoreData = assessmentData;
        }),
    );
    promises.push(
        indexedDBInstance.getItem(IndexedDBDataKeys.userConfiguration).then(userConfig => {
            persistedData.userConfigurationData = userConfig;
        }),
    );

    return Promise.all(promises).then(() => persistedData);
}
