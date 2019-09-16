// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';

export interface PersistedData {
    assessmentStoreData: AssessmentStoreData;
    userConfigurationData: UserConfigurationStoreData;
}
export function getPersistedData(indexedDBInstance: IndexedDBAPI, dataKeysToFetch: string[]): Promise<PersistedData> {
    const persistedData = {} as PersistedData;

    const promises: Array<Promise<any>> = dataKeysToFetch.map(key => {
        return indexedDBInstance.getItem(key).then(assessmentData => {
            persistedData.assessmentStoreData = assessmentData;
        });
    });

    return Promise.all(promises).then(() => persistedData);
}
