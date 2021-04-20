// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

const fastPassVisualizations: VisualizationType[] = [
    VisualizationType.Issues,
    VisualizationType.TabStops,
];

const fastPassFeatureFlagsToVisualizationTypes: DictionaryStringTo<VisualizationType> = {
    [FeatureFlags.needsReview]: VisualizationType.NeedsReview,
};

export function createFastPassProviderWithFeatureFlags(featureFlagStoreData: FeatureFlagStoreData) {
    return new FastPassProvider(
        fastPassVisualizations,
        fastPassFeatureFlagsToVisualizationTypes,
        featureFlagStoreData,
    );
}
export class FastPassProvider {
    constructor(
        private fastPassVisualizations: VisualizationType[],
        private fastPassFeatureFlags: DictionaryStringTo<VisualizationType>,
        private featureFlagStoreData: FeatureFlagStoreData,
    ) {
        this.addVisualizationsWithEnabledFeatureFlags(this.featureFlagStoreData);
    }

    public getAllFastPassVisualizations(): VisualizationType[] {
        return this.fastPassVisualizations.slice();
    }

    public getNumTests(): number {
        return this.getAllFastPassVisualizations().length;
    }

    public getStepIndexForType(visualizationType: VisualizationType): number {
        return this.getAllFastPassVisualizations().findIndex(v => v === visualizationType) + 1;
    }

    private addVisualizationsWithEnabledFeatureFlags(
        featureFlagStoreData: FeatureFlagStoreData,
    ): void {
        const visualizations = this.getAllFastPassVisualizations();
        for (const flag in this.fastPassFeatureFlags) {
            if (featureFlagStoreData[flag]) {
                visualizations.push(this.fastPassFeatureFlags[flag]);
            }
        }
        this.fastPassVisualizations = visualizations;
    }
}
