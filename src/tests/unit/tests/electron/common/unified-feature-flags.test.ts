// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    getAllFeatureFlagDetailsUnified,
    getDefaultFeatureFlagValuesUnified,
    UnifiedFeatureFlags,
} from 'electron/common/unified-feature-flags';
import { findIndex, forEach, indexOf, keys } from 'lodash';

describe('FeatureFlagsTest', () => {
    let featureFlagValues: FeatureFlagStoreData;

    beforeEach(() => {
        featureFlagValues = getDefaultFeatureFlagValuesUnified();
    });

    test('default values', () => {
        const expectedValues: FeatureFlagStoreData = {
            [UnifiedFeatureFlags.logTelemetryToConsole]: false,
            [UnifiedFeatureFlags.showAllFeatureFlags]: false,
        };

        const featureFlagValueKeys = keys(featureFlagValues);
        const expectedValueKeys = keys(expectedValues);

        expect(featureFlagValueKeys).toEqual(expectedValueKeys);

        forEach(expectedValues, (value, key) => {
            expect(featureFlagValues[key]).toEqual(value);
        });
    });

    test('all feature flag have a corresponding feature flag value', () => {
        const featureFlags = keys(UnifiedFeatureFlags).sort();
        const featureFlagValueKeys = keys(featureFlagValues).sort();

        expect(featureFlagValueKeys).toEqual(featureFlags);
    });

    test('feature flag value is not null nor undefined', () => {
        const featureFlags = keys(UnifiedFeatureFlags);
        forEach(featureFlags, flagName => {
            expect(featureFlagValues[flagName]).toBeDefined();
        });
    });

    test('feature flag property name should be the same as the property value', () => {
        const featureFlagNames = keys(UnifiedFeatureFlags);

        forEach(featureFlagNames, flagName => {
            expect(flagName).toEqual(UnifiedFeatureFlags[flagName]);
        });
    });

    test('all feature flags should have matching details', () => {
        const names = keys(UnifiedFeatureFlags);
        const details = getAllFeatureFlagDetailsUnified();

        forEach(names, featureFlagName => {
            expect(findIndex(details, ['id', featureFlagName])).not.toBe(-1);
        });
    });

    test('all details should have matching feature flags', () => {
        const details = getAllFeatureFlagDetailsUnified();
        const names = keys(UnifiedFeatureFlags);

        forEach(details, detail => {
            expect(indexOf(names, detail.id)).not.toBe(-1);
        });
    });

    test('all details should have non-empty names and descriptions', () => {
        const details = getAllFeatureFlagDetailsUnified();

        forEach(details, detail => {
            expect(detail.displayableName.length > 0).toBeTruthy();
            expect(detail.displayableDescription.length > 0).toBeTruthy();
        });
    });
});
