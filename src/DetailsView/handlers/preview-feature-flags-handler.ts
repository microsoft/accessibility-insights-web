// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { FeatureFlagDetail, FeatureFlags } from '../../common/feature-flags';
import { DisplayableFeatureFlag } from '../../common/types/store-data/displayable-feature-flag';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';

export class PreviewFeatureFlagsHandler {
    private featureFlagDetails: FeatureFlagDetail[];

    constructor(featureFlagDetails: FeatureFlagDetail[]) {
        this.featureFlagDetails = featureFlagDetails;
    }

    public getDisplayableFeatureFlags(
        featureFlagValues: FeatureFlagStoreData,
    ): DisplayableFeatureFlag[] {
        const showAll = featureFlagValues[FeatureFlags.showAllFeatureFlags];
        const results: DisplayableFeatureFlag[] = [];

        _.each(this.featureFlagDetails, detail => {
            if (showAll || detail.isPreviewFeature) {
                results.push({
                    id: detail.id,
                    displayableName: detail.displayableName,
                    displayableDescription: detail.displayableDescription,
                    enabled: featureFlagValues[detail.id],
                });
            }
        });

        return results;
    }
}
