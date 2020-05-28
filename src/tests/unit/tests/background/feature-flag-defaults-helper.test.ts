// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { FeatureFlagDetail } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

describe('FeatureFlagDefaultsHelperTest', () => {
    const forcedDefaultFeature = 'forcedDefaultFeature';
    const unforcedDefaultFeature = 'unforcedDefaultFeature';
    const featureFlagDetails: FeatureFlagDetail[] = [
        {
            id: unforcedDefaultFeature,
            defaultValue: true,
            displayableName: 'name',
            displayableDescription: 'description',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: forcedDefaultFeature,
            defaultValue: false,
            displayableName: 'name',
            displayableDescription: 'description',
            isPreviewFeature: false,
            forceDefault: true,
        },
    ];
    let testSubject: FeatureFlagDefaultsHelper;

    beforeEach(() => {
        testSubject = new FeatureFlagDefaultsHelper(() => featureFlagDetails);
    });

    test('get default values', () => {
        const expectedDefaultValues: FeatureFlagStoreData = {};
        expectedDefaultValues[forcedDefaultFeature] = false;
        expectedDefaultValues[unforcedDefaultFeature] = true;

        const defaultValues = testSubject.getDefaultFeatureFlagValues();

        expect(defaultValues).toEqual(expectedDefaultValues);
    });

    test('get force default flags', () => {
        const expectedDefaultFlags = [forcedDefaultFeature];

        const defaultFlags = testSubject.getForceDefaultFlags();

        expect(defaultFlags).toEqual(expectedDefaultFlags);
    });
});
