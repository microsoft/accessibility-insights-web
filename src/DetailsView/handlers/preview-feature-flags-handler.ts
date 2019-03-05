// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { FeatureFlagDetail, FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IDisplayableFeatureFlag } from '../../common/types/store-data/idisplayable-feature-flag';

export class PreviewFeatureFlagsHandler {
    private featureFlagDetails: FeatureFlagDetail[];

    constructor(featureFlagDetails: FeatureFlagDetail[]) {
        this.featureFlagDetails = featureFlagDetails;
    }

    public getDisplayableFeatureFlags(featureFlagValues: FeatureFlagStoreData): IDisplayableFeatureFlag[] {
        const showAll = featureFlagValues[FeatureFlags.showAllFeatureFlags];
        const results: IDisplayableFeatureFlag[] = [];

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
