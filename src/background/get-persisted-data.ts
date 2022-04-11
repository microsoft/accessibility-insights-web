// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
    cardSelectionStoreData: CardSelectionStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    devToolStoreData: DevToolStoreData;
    commandStoreData: CommandStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
    inspectStoreData: InspectStoreData;
    scopingStoreData: ScopingStoreData;
    tabStoreData: TabStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    needsReviewScanResultsStoreData: NeedsReviewScanResultStoreData;
    needsReviewCardSelectionStoreData: NeedsReviewCardSelectionStoreData;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
}

const keyToPersistedDataMappingOverrides = {
    [IndexedDBDataKeys.assessmentStore]: 'assessmentStoreData',
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
            const persistedDataKey = keyToPersistedDataMappingOverrides[key] ?? `${key}Data`;
            persistedData[persistedDataKey] = data;
        });
    });

    return Promise.all(promises).then(() => persistedData);
}
