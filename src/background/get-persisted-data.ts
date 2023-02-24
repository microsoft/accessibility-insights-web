// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { CommandStoreData } from 'common/types/store-data/command-store-data';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { DevToolStoreData } from 'common/types/store-data/dev-tool-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { InspectStoreData } from 'common/types/store-data/inspect-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DictionaryNumberTo, DictionaryStringTo } from 'types/common-types';
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { IndexedDBDataKeys } from './IndexedDBDataKeys';
import { InstallationData } from './installation-data';

export interface PersistedData {
    tabData: {
        [tabId: number]: TabSpecificPersistedData;
    };
    assessmentStoreData: AssessmentStoreData;
    quickAssessStoreData: AssessmentStoreData;
    userConfigurationData: UserConfigurationStoreData;
    installationData: InstallationData;
    featureFlags: FeatureFlagStoreData;
    commandStoreData: CommandStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
    scopingStoreData: ScopingStoreData;
    knownTabIds: DictionaryNumberTo<string>;
    tabIdToDetailsViewMap: DictionaryStringTo<number>;
}

export interface TabSpecificPersistedData {
    cardSelectionStoreData: CardSelectionStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    devToolStoreData: DevToolStoreData;
    inspectStoreData: InspectStoreData;
    needsReviewScanResultsStoreData: NeedsReviewScanResultStoreData;
    needsReviewCardSelectionStoreData: NeedsReviewCardSelectionStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    tabStoreData: TabStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    visualizationStoreData: VisualizationStoreData;
    assessmentCardSelectionStoreData: AssessmentCardSelectionStoreData;
}

const keyToPersistedDataMappingOverrides = {
    [IndexedDBDataKeys.assessmentStore]: 'assessmentStoreData',
    [IndexedDBDataKeys.quickAssessStore]: 'quickAssessStoreData',
    [IndexedDBDataKeys.installation]: 'installationData',
    [IndexedDBDataKeys.unifiedFeatureFlags]: 'featureFlags',
    [IndexedDBDataKeys.knownTabIds]: 'knownTabIds',
    [IndexedDBDataKeys.tabIdToDetailsViewMap]: 'tabIdToDetailsViewMap',
};

function getPersistedDataKey(key: string): string {
    return keyToPersistedDataMappingOverrides[key] ?? `${key}Data`;
}

function getGlobalPersistedPromises(
    dataKeysToFetch: string[],
    indexedDBInstance: IndexedDBAPI,
    persistedData: PersistedData,
): Promise<any>[] {
    const promises: Array<Promise<any>> = dataKeysToFetch.map(key => {
        return indexedDBInstance.getItem(key).then(data => {
            const persistedDataKey = getPersistedDataKey(key);
            persistedData[persistedDataKey] = data;
        });
    });

    return promises;
}

function getTabSpecificPersistedPromises(
    tabId: number,
    keyFunc: (tabId) => string,
    indexedDBInstance: IndexedDBAPI,
    persistedData: PersistedData,
): Promise<any> {
    const keyWithTabId = keyFunc(tabId);
    const keyWithoutTabId = keyFunc('');

    return indexedDBInstance.getItem(keyWithTabId).then(data => {
        const persistedDataKey = getPersistedDataKey(keyWithoutTabId);
        persistedData.tabData[tabId][persistedDataKey] = data;
    });
}

function getAllTabSpecificPersistedPromises(
    tabId: number,
    indexedDBInstance: IndexedDBAPI,
    persistedData: PersistedData,
): Promise<any>[] {
    persistedData.tabData[tabId] = {} as TabSpecificPersistedData;

    return IndexedDBDataKeys.tabSpecificKeys.map(keyFunc => {
        return getTabSpecificPersistedPromises(tabId, keyFunc, indexedDBInstance, persistedData);
    });
}

export function getGlobalPersistedData(
    indexedDBInstance: IndexedDBAPI,
    dataKeysToFetch: string[],
    options?: { ignorePersistedData: boolean }, // this option is for tests to ensure they can use mock-adb
): Promise<PersistedData> {
    const persistedData = {} as PersistedData;
    if (options?.ignorePersistedData) {
        return Promise.resolve(persistedData); //empty object
    }

    const promises = getGlobalPersistedPromises(dataKeysToFetch, indexedDBInstance, persistedData);

    return Promise.all(promises).then(() => persistedData);
}

export async function getAllPersistedData(indexedDBInstance: IndexedDBAPI): Promise<PersistedData> {
    const persistedData = { tabData: {} } as PersistedData;

    let promises = getGlobalPersistedPromises(
        IndexedDBDataKeys.globalKeys,
        indexedDBInstance,
        persistedData,
    );

    const knownTabIds: DictionaryNumberTo<string> = await indexedDBInstance.getItem(
        IndexedDBDataKeys.knownTabIds,
    );
    if (knownTabIds && Object.keys(knownTabIds).length > 0) {
        Object.keys(knownTabIds).forEach(tabId => {
            const tabSpecificPromises = getAllTabSpecificPersistedPromises(
                parseInt(tabId),
                indexedDBInstance,
                persistedData,
            );
            promises = promises.concat(tabSpecificPromises);
        });
    }

    return Promise.all(promises).then(() => persistedData);
}
