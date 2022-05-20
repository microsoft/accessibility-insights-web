// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';

export interface TargetPageStoreData {
    visualizationStoreData: VisualizationStoreData;
    tabStoreData: TabStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    needsReviewScanResultStoreData: NeedsReviewScanResultStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
    needsReviewCardSelectionStoreData: NeedsReviewCardSelectionStoreData;
}

export class ClientStoreListener {
    private onReadyToExecuteVisualizationUpdates: ((storeData: TargetPageStoreData) => void)[] = [];
    constructor(private storeHub: BaseClientStoresHub<TargetPageStoreData>) {
        this.storeHub.addChangedListenerToAllStores(this.onChangedState);
    }

    public registerOnReadyToExecuteVisualizationCallback = (
        callback: (storeData: TargetPageStoreData) => void,
    ) => {
        this.onReadyToExecuteVisualizationUpdates.push(callback);
    };

    private onChangedState = (): void => {
        if (!this.storeHub.hasStores() || !this.storeHub.hasStoreData()) {
            return;
        }

        const storeData = this.storeHub.getAllStoreData() as TargetPageStoreData;
        if (storeData.visualizationStoreData.scanning != null) {
            return;
        }

        this.onReadyToExecuteVisualizationUpdates.forEach(callback => callback(storeData));
    };
}
