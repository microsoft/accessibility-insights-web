// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { LocalStorageDataKeys } from '../../local-storage-data-keys';
import { LocalStorageData } from '../../storage-data';

import { FeatureFlags, getDefaultFeatureFlagValues, getForceDefaultFlags } from '../../../common/feature-flags';
import { StoreNames } from '../../../common/stores/store-names';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { FeatureFlagActions, FeatureFlagPayload } from '../../actions/feature-flag-actions';
import { BaseStore } from '../base-store';
import { BrowserAdapter } from './../../browser-adapter';

export class FeatureFlagStore extends BaseStore<FeatureFlagStoreData> {
    private featureFlagActions: FeatureFlagActions;
    private browserAdapter: BrowserAdapter;
    private userData: LocalStorageData;

    constructor(featureFlagActions: FeatureFlagActions, browserAdapter: BrowserAdapter, userData: LocalStorageData) {
        super(StoreNames.FeatureFlagStore);

        this.featureFlagActions = featureFlagActions;
        this.browserAdapter = browserAdapter;
        this.userData = userData;
    }

    public initialize(): void {
        const initialState = this.computeInitialState();
        super.initialize(initialState);
    }

    public getDefaultState(): FeatureFlagStoreData {
        return getDefaultFeatureFlagValues();
    }

    public getForceDefaultFlags(): FeatureFlags[] {
        return getForceDefaultFlags();
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

    @autobind
    private onSetFeatureFlags(payload: FeatureFlagPayload): void {
        this.state[payload.feature] = payload.enabled;
        this.browserAdapter.setUserData({ [LocalStorageDataKeys.featureFlags]: this.state });
        this.emitChanged();
    }

    @autobind
    private onResetFeatureFlags(): void {
        this.state = this.getDefaultState();
        this.emitChanged();
    }
}
