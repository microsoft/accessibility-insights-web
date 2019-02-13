// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { cloneDeep } from 'lodash';

import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { SetTelemetryStatePayload, SetHighContrastModePayload, SetIssueTrackerPathPayload } from '../../actions/action-payloads';
import { FeatureFlagPayload } from '../../actions/feature-flag-actions';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';
import { BaseStore } from '../base-store';
import { FeatureFlags } from '../../../common/feature-flags';

export class UserConfigurationStore extends BaseStore<UserConfigurationStoreData> {
    public static readonly defaultState: UserConfigurationStoreData = {
        enableTelemetry: false,
        isFirstTime: true,
        enableHighContrast: false,
    };

    constructor(
        private readonly initialState: UserConfigurationStoreData,
        private readonly userConfigActions: UserConfigurationActions,
        private readonly indexDbApi: IndexedDBAPI,
    ) {
        super(StoreNames.UserConfigurationStore);
    }

    public getDefaultState(): UserConfigurationStoreData {
        return this.initialState ? cloneDeep(this.initialState) : cloneDeep(UserConfigurationStore.defaultState);
    }

    protected addActionListeners(): void {
        this.userConfigActions.getCurrentState.addListener(this.onGetCurrentState);
        this.userConfigActions.setTelemetryState.addListener(this.onSetTelemetryState);
        this.userConfigActions.setHighContrastMode.addListener(this.onSetHighContrastMode);
        this.userConfigActions.notifyFeatureFlagChange.addListener(this.onNotifyFeatureFlagChange);
        this.userConfigActions.setIssueTrackerPath.addListener(this.onSetIssueTrackerPath);
    }

    @autobind
    private onSetTelemetryState(payload: SetTelemetryStatePayload): void {
        this.state.isFirstTime = false;
        this.state.enableTelemetry = payload.enableTelemetry;

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }

    @autobind
    private onSetHighContrastMode(payload: SetHighContrastModePayload): void {
        this.state.enableHighContrast = payload.enableHighContrast;

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }

    @autobind
    private onNotifyFeatureFlagChange(payload: FeatureFlagPayload): void {
        if (payload.feature === FeatureFlags.highContrastMode && payload.enabled === false) {
            this.onSetHighContrastMode({ enableHighContrast: false });
        }
    }

    @autobind
    private onSetIssueTrackerPath(payload: SetIssueTrackerPathPayload) {
        this.state.issueTrackerPath = payload.issueTrackerPath;

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }
}
