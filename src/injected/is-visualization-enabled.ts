// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';

export type IsVisualizationEnabledCallback = (
    config: VisualizationConfiguration,
    step: string,
    visualizationState: VisualizationStoreData,
    assessmentState: AssessmentStoreData,
    tabState: TabStoreData,
) => boolean;

export const isVisualizationEnabled: IsVisualizationEnabledCallback = (
    config: VisualizationConfiguration,
    step: string,
    visualizationState: VisualizationStoreData,
    assessmentState: AssessmentStoreData,
    tabState: TabStoreData,
) => {
    const scanData = config.getStoreData(visualizationState.tests);
    return (
        config.getTestStatus(scanData, step) &&
        (isAdhoc(config) ||
            assessmentState.persistedTabInfo === null ||
            tabState.id === assessmentState.persistedTabInfo.id)
    );
};

function isAdhoc(config: VisualizationConfiguration): boolean {
    return config.testMode === TestMode.Adhoc;
}
