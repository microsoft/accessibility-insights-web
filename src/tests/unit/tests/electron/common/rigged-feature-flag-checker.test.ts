// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RiggedFeatureFlagChecker } from 'electron/common/rigged-feature-flag-checker';

describe('RiggedFeatureFlagChecker', () => {
    it('checks if a feature flag is enabled', () => {
        const testSubject = new RiggedFeatureFlagChecker();

        expect(testSubject.isEnabled('any feature flag should work')).toBe(true);
    });
});
