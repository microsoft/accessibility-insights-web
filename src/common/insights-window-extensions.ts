// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagsController } from 'background/feature-flags-controller';
import { UserConfigurationController } from 'background/user-configuration-controller';

export type InsightsWindowExtensions = {
    insightsFeatureFlags: FeatureFlagsController;
    insightsUserConfiguration: UserConfigurationController;
};
