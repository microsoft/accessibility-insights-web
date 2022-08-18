// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';

export class AndroidSetupStartListener {
    constructor(
        private readonly userConfigStore: UserConfigurationStore,
        private readonly androidSetupStore: AndroidSetupStore,
        private readonly androidSetupActionCreator: AndroidSetupActionCreator,
    ) {}

    public initialize(): void {
        this.userConfigStore.addChangedListener(async () => this.storeChanged());
        this.androidSetupStore.addChangedListener(this.storeChanged);

        this.storeChanged();
    }

    private storeChanged = () => {
        const stepId = this.androidSetupStore.getState().currentStepId;
        const telemetryDecisionMade = !this.userConfigStore.getState().isFirstTime;

        if (telemetryDecisionMade && stepId === 'wait-to-start') {
            this.androidSetupActionCreator.readyToStart();

            this.userConfigStore.removeChangedListener(async () => this.storeChanged());
            this.androidSetupStore.removeChangedListener(this.storeChanged);
        }
    };
}
