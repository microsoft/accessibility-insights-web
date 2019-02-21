// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { cloneDeep } from 'lodash';

import { FeatureFlags } from '../../../common/feature-flags';
import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import {
    SetBugServicePayload,
    SetBugServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../actions/action-payloads';
import { FeatureFlagPayload } from '../../actions/feature-flag-actions';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';
import { BaseStore } from '../base-store';

export class UserConfigurationStore extends BaseStore<UserConfigurationStoreData> {
    public static readonly defaultState: UserConfigurationStoreData = {
        isFirstTime: true,
        enableTelemetry: false,
        enableHighContrast: false,
        bugService: 'none',
        bugServicePropertiesMap: {},
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
        this.userConfigActions.setBugService.addListener(this.onSetBugService);
        this.userConfigActions.setBugServiceProperty.addListener(this.onSetBugServiceProperty);
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
    private onSetBugService(payload: SetBugServicePayload): void {
        this.state.bugService = payload.bugServiceName;

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }

    @autobind
    private onSetBugServiceProperty(payload: SetBugServicePropertyPayload): void {
        if (!this.state.bugServicePropertiesMap) {
            this.state.bugServicePropertiesMap = {};
        }
        if (!this.state.bugServicePropertiesMap[payload.bugServiceName]) {
            this.state.bugServicePropertiesMap[payload.bugServiceName] = {};
        }

        this.state.bugServicePropertiesMap[payload.bugServiceName][payload.propertyName] = payload.propertyValue;

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
