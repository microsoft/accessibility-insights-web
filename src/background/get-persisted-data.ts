// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';
import { InstallationData } from './installation-data';

export interface PersistedData {
    assessmentStoreData: AssessmentStoreData;
    userConfigurationData: UserConfigurationStoreData;
    installationData: InstallationData;
    featureFlags: FeatureFlagStoreData;
}

const keyToPersistedDataMapping = {
    [IndexedDBDataKeys.assessmentStore]: 'assessmentStoreData',
    [IndexedDBDataKeys.userConfiguration]: 'userConfigurationData',
    [IndexedDBDataKeys.installation]: 'installationData',
    [IndexedDBDataKeys.unifiedFeatureFlags]: 'featureFlags',
};

export function getPersistedData(
    indexedDBInstance: IndexedDBAPI,
    dataKeysToFetch: string[],
    options?: { ignorePersistedData: boolean }, // this option is for tests to ensure they can use mock-adb
): Promise<PersistedData> {
    const persistedData = {} as PersistedData;
    if (options?.ignorePersistedData) {
        return Promise.resolve(persistedData); //empty object
    }

    const promises: Array<Promise<any>> = dataKeysToFetch.map(key => {
        return indexedDBInstance.getItem(key).then(data => {
            persistedData[keyToPersistedDataMapping[key]] = data;
        });
    });

    return Promise.all(promises).then(() => persistedData);
}
