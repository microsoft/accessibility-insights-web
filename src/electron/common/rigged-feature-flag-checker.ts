// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagChecker } from 'background/feature-flag-checker';

// To be used on AI-Android until we get proper feature flag implementation.
export class RiggedFeatureFlagChecker implements FeatureFlagChecker {
    public isEnabled(feature: string): boolean {
        return true;
    }
}
