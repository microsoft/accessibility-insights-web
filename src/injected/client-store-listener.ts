// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
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
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
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
        const storeData = this.storeHub.getAllStoreData();
        if (storeData == null) {
            return;
        }

        if (storeData.visualizationStoreData.scanning != null) {
            return;
        }

        this.onReadyToExecuteVisualizationUpdates.forEach(callback => callback(storeData));
    };
}
