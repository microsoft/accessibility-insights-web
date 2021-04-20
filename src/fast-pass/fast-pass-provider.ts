// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

const fastPassVisualizationTypes: VisualizationType[] = [
    VisualizationType.Issues,
    VisualizationType.TabStops,
    VisualizationType.NeedsReview,
];

const fastPassFeatureFlagsToVisualizationTypes: DictionaryStringTo<VisualizationType> = {};

export function createFastPassProviderWithFeatureFlags(featureFlagStoreData: FeatureFlagStoreData) {
    return new FastPassProvider(
        fastPassVisualizationTypes,
        fastPassFeatureFlagsToVisualizationTypes,
        featureFlagStoreData,
    );
}
export class FastPassProvider {
    constructor(
        private visualizationTypes: VisualizationType[],
        private featureFlagsToVisualizationTypes: DictionaryStringTo<VisualizationType>,
        private featureFlagStoreData: FeatureFlagStoreData,
    ) {
        this.addVisualizationsWithEnabledFeatureFlags(this.featureFlagStoreData);
    }

    public getAllFastPassVisualizations(): VisualizationType[] {
        return this.visualizationTypes.slice();
    }

    public getStepsText(selectedTest: VisualizationType): string {
        const visualizations = this.getAllFastPassVisualizations();
        const stepIndex = visualizations.findIndex(v => v === selectedTest) + 1;
        const totalTests = visualizations.length;

        return `Step ${stepIndex} of ${totalTests}`;
    }

    private addVisualizationsWithEnabledFeatureFlags(
        featureFlagStoreData: FeatureFlagStoreData,
    ): void {
        const visualizationTypes = this.getAllFastPassVisualizations();
        for (const flag in this.featureFlagsToVisualizationTypes) {
            if (featureFlagStoreData[flag]) {
                visualizationTypes.push(this.featureFlagsToVisualizationTypes[flag]);
            }
        }
        this.visualizationTypes = visualizationTypes;
    }
}
