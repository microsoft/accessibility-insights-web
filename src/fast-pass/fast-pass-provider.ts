// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

export class FastPassProvider {
    private fastPassVisualizations: VisualizationType[] = [
        VisualizationType.Issues,
        VisualizationType.TabStops,
    ];

    private fastPassFeatureFlags: DictionaryStringTo<VisualizationType> = {
        [FeatureFlags.needsReview]: VisualizationType.NeedsReview,
    };

    constructor(featureFlagStoreData: FeatureFlagStoreData) {
        this.addVisualizationsWithEnabledFeatureFlags(featureFlagStoreData);
    }

    public getAllFastPassVisualizations(): VisualizationType[] {
        return this.fastPassVisualizations.slice();
    }

    public getNumTests(): number {
        return this.fastPassVisualizations.length;
    }

    public getStepIndexForType(visualizationType: VisualizationType): number {
        return this.fastPassVisualizations.findIndex(v => v === visualizationType) + 1;
    }

    private addVisualizationsWithEnabledFeatureFlags(
        featureFlagStoreData: FeatureFlagStoreData,
    ): void {
        for (const flag in this.fastPassFeatureFlags) {
            if (featureFlagStoreData[flag]) {
                this.fastPassVisualizations.push(this.fastPassFeatureFlags[flag]);
            }
        }
    }
}
