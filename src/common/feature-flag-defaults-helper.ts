// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagDetail } from 'common/feature-flags';
import { forEach } from 'lodash';

import { FeatureFlagStoreData } from './types/store-data/feature-flag-store-data';

export class FeatureFlagDefaultsHelper {
    public constructor(private readonly getFeatureFlagDetails: () => FeatureFlagDetail[]) {}

    public getDefaultFeatureFlagValues(): FeatureFlagStoreData {
        const details: FeatureFlagDetail[] = this.getFeatureFlagDetails();
        const values: FeatureFlagStoreData = {};
        forEach(details, detail => {
            values[detail.id] = detail.defaultValue;
        });
        return values;
    }

    public getForceDefaultFlags(): string[] {
        const details: FeatureFlagDetail[] = this.getFeatureFlagDetails();
        const forceDefaultFlags: string[] = [];
        forEach(details, detail => {
            if (detail.forceDefault) {
                forceDefaultFlags.push(detail.id);
            }
        });
        return forceDefaultFlags;
    }
}
