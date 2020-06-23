// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';

export class AndroidSetupStartListener {
    constructor(
        private readonly userConfigStore: UserConfigurationStore,
        private readonly androidSetupStore: AndroidSetupStore,
        private readonly featureFlagStore: FeatureFlagStore,
        private readonly androidSetupActionCreator: AndroidSetupActionCreator,
    ) {}

    public initialize(): void {
        this.userConfigStore.addChangedListener(this.storeChanged);
        this.featureFlagStore.addChangedListener(this.storeChanged);
        this.androidSetupStore.addChangedListener(this.storeChanged);

        this.storeChanged();
    }

    private storeChanged = () => {
        const stepId = this.androidSetupStore.getState().currentStepId;
        const featureEnabled = this.featureFlagStore.getState()[UnifiedFeatureFlags.adbSetupView];
        const telemetryDecisionMade = !this.userConfigStore.getState().isFirstTime;

        if (featureEnabled && telemetryDecisionMade && stepId === 'wait-to-start') {
            this.androidSetupActionCreator.readyToStart();

            this.userConfigStore.removeChangedListener(this.storeChanged);
            this.featureFlagStore.removeChangedListener(this.storeChanged);
            this.androidSetupStore.removeChangedListener(this.storeChanged);
        }
    };
}
