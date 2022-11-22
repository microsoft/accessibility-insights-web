// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';

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

        await Promise.all(
            this.visualizationConfigurationFactory.forEachConfig(
                async (testConfig, type, requirementConfig) => {
                    await this.visualizationUpdater(type, requirementConfig?.key, storeData);
                },
            ),
        );
    };
}
