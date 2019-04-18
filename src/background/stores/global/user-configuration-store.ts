// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { cloneDeep, isPlainObject } from 'lodash';

import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import {
    SaveBugFilingSettingsPayload,
    SetBugServicePayload,
    SetBugServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../actions/action-payloads';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';
import { BaseStoreImpl } from '../base-store-impl';

export class UserConfigurationStore extends BaseStoreImpl<UserConfigurationStoreData> {
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
        this.userConfigActions.setIssueTrackerPath.addListener(this.onSetIssueTrackerPath);
        this.userConfigActions.saveIssueFilingSettings.addListener(this.onSaveIssueSettings);
    }

    @autobind
    private onSetTelemetryState(payload: SetTelemetryStatePayload): void {
        this.state.isFirstTime = false;
        this.state.enableTelemetry = payload.enableTelemetry;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSetHighContrastMode(payload: SetHighContrastModePayload): void {
        this.state.enableHighContrast = payload.enableHighContrast;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSetBugService(payload: SetBugServicePayload): void {
        this.state.bugService = payload.bugServiceName;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSetBugServiceProperty(payload: SetBugServicePropertyPayload): void {
        if (!isPlainObject(this.state.bugServicePropertiesMap)) {
            this.state.bugServicePropertiesMap = {};
        }
        if (!isPlainObject(this.state.bugServicePropertiesMap[payload.bugServiceName])) {
            this.state.bugServicePropertiesMap[payload.bugServiceName] = {};
        }

        this.state.bugServicePropertiesMap[payload.bugServiceName][payload.propertyName] = payload.propertyValue;

        this.saveAndEmitChanged();
    }

    @autobind
    private onSetIssueTrackerPath(payload: SetIssueTrackerPathPayload): void {
        this.state.issueTrackerPath = payload.issueTrackerPath;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSaveIssueSettings(payload: SaveBugFilingSettingsPayload): void {
        const bugService = payload.bugServiceName;
        this.state.bugService = payload.bugServiceName;
        this.state.bugServicePropertiesMap[bugService] = payload.bugFilingSettings;
        this.saveAndEmitChanged();
    }

    private saveAndEmitChanged(): void {
        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }
}
