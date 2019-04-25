// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { cloneDeep, isPlainObject } from 'lodash';

import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
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
        private readonly persistedState: UserConfigurationStoreData,
        private readonly userConfigActions: UserConfigurationActions,
        private readonly indexDbApi: IndexedDBAPI,
    ) {
        super(StoreNames.UserConfigurationStore);
    }

    private generateDefaultState(persisted: UserConfigurationStoreData): UserConfigurationStoreData {
        const persistedState = cloneDeep(persisted);
        const defaultState = cloneDeep(UserConfigurationStore.defaultState);
        return Object.assign(defaultState, persistedState);
    }

    public getDefaultState(): UserConfigurationStoreData {
        return this.generateDefaultState(this.persistedState);
    }

    protected addActionListeners(): void {
        this.userConfigActions.getCurrentState.addListener(this.onGetCurrentState);
        this.userConfigActions.setTelemetryState.addListener(this.onSetTelemetryState);
        this.userConfigActions.setHighContrastMode.addListener(this.onSetHighContrastMode);
        this.userConfigActions.setIssueService.addListener(this.onSetIssueService);
        this.userConfigActions.setIssueServiceProperty.addListener(this.onSetIssueServiceProperty);
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
    private onSetIssueService(payload: SetIssueFilingServicePayload): void {
        this.state.bugService = payload.issueFilingServiceName;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSetIssueServiceProperty(payload: SetIssueFilingServicePropertyPayload): void {
        if (!isPlainObject(this.state.bugServicePropertiesMap)) {
            this.state.bugServicePropertiesMap = {};
        }
        if (!isPlainObject(this.state.bugServicePropertiesMap[payload.issueFilingServiceName])) {
            this.state.bugServicePropertiesMap[payload.issueFilingServiceName] = {};
        }

        this.state.bugServicePropertiesMap[payload.issueFilingServiceName][payload.propertyName] = payload.propertyValue;

        this.saveAndEmitChanged();
    }

    @autobind
    private onSetIssueTrackerPath(payload: SetIssueTrackerPathPayload): void {
        this.state.issueTrackerPath = payload.issueTrackerPath;
        this.saveAndEmitChanged();
    }

    @autobind
    private onSaveIssueSettings(payload: SaveIssueFilingSettingsPayload): void {
        const bugService = payload.issueFilingServiceName;
        this.state.bugService = bugService;
        this.state.bugServicePropertiesMap[bugService] = payload.issueFilingSettings;
        this.saveAndEmitChanged();
    }

    private saveAndEmitChanged(): void {
        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.indexDbApi.setItem(IndexedDBDataKeys.userConfiguration, this.state);
        this.emitChanged();
    }
}
