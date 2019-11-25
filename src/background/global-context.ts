// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagsController } from './feature-flags-controller';
import { Interpreter } from './interpreter';
import { GlobalStoreHub } from './stores/global/global-store-hub';
import { UserConfigurationController } from './user-configuration-controller';

export class GlobalContext {
    constructor(
        public readonly interpreter: Interpreter,
        public readonly stores: GlobalStoreHub,
        public readonly featureFlagsController: FeatureFlagsController,
        public readonly userConfigurationController: UserConfigurationController,
    ) {}
}
