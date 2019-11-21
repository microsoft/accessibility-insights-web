// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagsController } from './feature-flags-controller';
import { Interpreter } from './interpreter';
import { GlobalStoreHub } from './stores/global/global-store-hub';

export class GlobalContext {
    public readonly interpreter: Interpreter;
    public readonly featureFlagsController: FeatureFlagsController;
    public readonly stores: GlobalStoreHub;

    constructor(
        interpreter: Interpreter,
        storeHub: GlobalStoreHub,
        featureFlagsController: FeatureFlagsController,
    ) {
        this.interpreter = interpreter;
        this.stores = storeHub;
        this.featureFlagsController = featureFlagsController;
    }
}
