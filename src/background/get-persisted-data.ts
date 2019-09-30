// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';
import { InstallationData } from './installation-data';

export interface PersistedData {
    assessmentStoreData: AssessmentStoreData;
    userConfigurationData: UserConfigurationStoreData;
    installationData: InstallationData;
}

const keyToPersistedDataMapping = {
    [IndexedDBDataKeys.assessmentStore]: 'assessmentStoreData',
    [IndexedDBDataKeys.userConfiguration]: 'userConfigurationData',
    [IndexedDBDataKeys.installation]: 'installationData',
};

export function getPersistedData(indexedDBInstance: IndexedDBAPI, dataKeysToFetch: string[]): Promise<PersistedData> {
    const persistedData = {} as PersistedData;

    const promises: Array<Promise<any>> = dataKeysToFetch.map(key => {
        return indexedDBInstance.getItem(key).then(data => {
            persistedData[keyToPersistedDataMapping[key]] = data;
        });
    });

    return Promise.all(promises).then(() => persistedData);
}
