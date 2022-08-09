// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { StoreNames } from 'common/stores/store-names';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { FeatureFlagActions, FeatureFlagPayload } from '../../actions/feature-flag-actions';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { LocalStorageData } from '../../storage-data';
import { BaseStoreImpl } from '../base-store-impl';

export class FeatureFlagStore extends BaseStoreImpl<FeatureFlagStoreData, Promise<void>> {
    constructor(
        private readonly featureFlagActions: FeatureFlagActions,
        private readonly storageAdapter: StorageAdapter,
        private readonly userData: LocalStorageData,
        private readonly featureFlagDefaultsHelper: FeatureFlagDefaultsHelper,
    ) {
        super(StoreNames.FeatureFlagStore);
    }

    public initialize(): void {
        const initialState = this.computeInitialState();
        super.initialize(initialState);
    }

    public getDefaultState(): FeatureFlagStoreData {
        return this.featureFlagDefaultsHelper.getDefaultFeatureFlagValues();
    }

    public getForceDefaultFlags(): string[] {
        return this.featureFlagDefaultsHelper.getForceDefaultFlags();
    }

    protected addActionListeners(): void {
        this.featureFlagActions.getCurrentState.addListener(this.onGetCurrentState);
        this.featureFlagActions.setFeatureFlag.addListener(this.onSetFeatureFlags);
        this.featureFlagActions.resetFeatureFlags.addListener(this.onResetFeatureFlags);
    }

    private computeInitialState(): FeatureFlagStoreData {
        const initialState = this.getDefaultState();
        const stateFromLocalStorage = this.userData ? this.userData.featureFlags : null;

        if (!stateFromLocalStorage) {
            return initialState;
        }

        const forceDefaultFlags = this.getForceDefaultFlags();
        for (const key in stateFromLocalStorage) {
            if (initialState[key] != null && forceDefaultFlags.indexOf(key) === -1) {
                initialState[key] = stateFromLocalStorage[key];
            }
        }

        return initialState;
    }

    private onSetFeatureFlags = async (payload: FeatureFlagPayload): Promise<void> => {
        this.state[payload.feature] = payload.enabled;
        this.storageAdapter
            .setUserData({ [LocalStorageDataKeys.featureFlags]: this.state })
            .catch(console.error);
        this.emitChanged();
    };

    private onResetFeatureFlags = async (): Promise<void> => {
        this.state = this.getDefaultState();
        this.emitChanged();
    };
}
