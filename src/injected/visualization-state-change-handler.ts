// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';

import { TargetPageStoreData } from './client-store-listener';
import { UpdateVisualization } from './target-page-visualization-updater';

export class VisualizationStateChangeHandler {
    constructor(
        private visualizationUpdater: UpdateVisualization,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {}

    public updateVisualizationsWithStoreData = async (storeData: TargetPageStoreData) => {
        if (!storeData.assessmentStoreData) {
            return;
        }

        const updateCalls = [];
        this.visualizationConfigurationFactory.forEachConfig(
            (
                testConfig: VisualizationConfiguration,
                type: VisualizationType,
                requirementConfig: Requirement,
            ) => {
                updateCalls.push(
                    this.visualizationUpdater(type, requirementConfig?.key, storeData),
                );
            },
        );

        await Promise.all(updateCalls);
    };
}
