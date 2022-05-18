// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';

import { AssessmentsProvider } from '../assessments/types/assessments-provider';
import { TargetPageStoreData } from './client-store-listener';
import { UpdateVisualization } from './target-page-visualization-updater';

export class VisualizationStateChangeHandler {
    constructor(
        private visualizations: VisualizationType[],
        private visualizationUpdater: UpdateVisualization,
        private assessmentProvider: AssessmentsProvider,
    ) {}

    public updateVisualizationsWithStoreData = (storeData: TargetPageStoreData) => {
        if (!storeData.assessmentStoreData) {
            return;
        }
        this.visualizations.forEach(visualizationType => {
            if (this.assessmentProvider.isValidType(visualizationType)) {
                const stepMap = this.assessmentProvider.getStepMap(visualizationType);
                Object.values(stepMap).forEach(step => {
                    this.visualizationUpdater(visualizationType, step.key, storeData);
                });
            } else {
                this.visualizationUpdater(visualizationType, null, storeData);
            }
        });
    };
}
