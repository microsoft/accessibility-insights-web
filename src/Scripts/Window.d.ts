// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagsController } from '../background/feature-flags-controller';


declare interface Window {
    insightsFeatureFlags: FeatureFlagsController;
}
