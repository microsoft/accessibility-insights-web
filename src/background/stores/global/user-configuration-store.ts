// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { cloneDeep, isPlainObject } from 'lodash';
import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from '../../actions/action-payloads';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';
import { BaseStoreImpl } from '../base-store-impl';

export class UserConfigurationStore extends BaseStoreImpl<UserConfigurationStoreData> {
    public static readonly defaultState: UserConfigurationStoreData = {
        isFirstTime: true,
        enableTelemetry: false,
        enableHighContrast: false,
        lastSelectedHighContrast: false,
        bugService: 'none',
        bugServicePropertiesMap: {},
        adbLocation: null,
        lastWindowBounds: null,
        lastWindowState: null,
        showAutoDetectedFailuresDialog: true,
    };

    constructor(
        private readonly persistedState: UserConfigurationStoreData,
        private readonly userConfigActions: UserConfigurationActions,
        private readonly indexDbApi: IndexedDBAPI,
        private readonly logger: Logger,
    ) {
        super(StoreNames.UserConfigurationStore);
    }

    private generateDefaultState(
        persisted: UserConfigurationStoreData,
    ): UserConfigurationStoreData {
        const persistedState = cloneDeep(persisted);
        const defaultState = cloneDeep(UserConfigurationStore.defaultState);
        return Object.assign(defaultState, persistedState);
    }

    public getDefaultState(): UserConfigurationStoreData {
        return this.generateDefaultState(this.persistedState);
    }

    public getState(): UserConfigurationStoreData {
        return cloneDeep(this.state);
    }

    protected addActionListeners(): void {
        this.userConfigActions.getCurrentState.addListener(this.onGetCurrentState);
        this.userConfigActions.setAdbLocation.addListener(this.onSetAdbLocation);
        this.userConfigActions.setTelemetryState.addListener(this.onSetTelemetryState);
        this.userConfigActions.setHighContrastMode.addListener(this.onSetHighContrastMode);
        this.userConfigActions.setNativeHighContrastMode.addListener(
            this.onSetNativeHighContrastMode,
        );
        this.userConfigActions.setIssueFilingService.addListener(this.onSetIssueFilingService);
        this.userConfigActions.setIssueFilingServiceProperty.addListener(
            this.onSetIssueFilingServiceProperty,
        );
        this.userConfigActions.saveIssueFilingSettings.addListener(this.onSaveIssueSettings);
        this.userConfigActions.saveWindowBounds.addListener(this.onSaveLastWindowBounds);
        this.userConfigActions.setAutoDetectedFailuresDialogState.addListener(
            this.onSetAutoDetectedFailuresDialogState,
        );
    }

    private onSetAdbLocation = (location: string): void => {
        this.state.adbLocation = location;
        this.saveAndEmitChanged();
    };

    private onSetTelemetryState = (enableTelemetry: boolean): void => {
        this.state.isFirstTime = false;
        this.state.enableTelemetry = enableTelemetry;
        this.saveAndEmitChanged();
    };

    private onSetHighContrastMode = (payload: SetHighContrastModePayload): void => {
        this.state.enableHighContrast = payload.enableHighContrast;
        this.state.lastSelectedHighContrast = payload.enableHighContrast;
        this.saveAndEmitChanged();
    };

    private onSetNativeHighContrastMode = (payload: SetNativeHighContrastModePayload): void => {
        this.state.enableHighContrast = payload.enableHighContrast
            ? true
            : this.state.lastSelectedHighContrast;
        this.saveAndEmitChanged();
    };

    private onSetIssueFilingService = (payload: SetIssueFilingServicePayload): void => {
        this.state.bugService = payload.issueFilingServiceName;
        this.saveAndEmitChanged();
    };

    private onSetIssueFilingServiceProperty = (
        payload: SetIssueFilingServicePropertyPayload,
    ): void => {
        if (!isPlainObject(this.state.bugServicePropertiesMap)) {
            this.state.bugServicePropertiesMap = {};
        }
        if (!isPlainObject(this.state.bugServicePropertiesMap[payload.issueFilingServiceName])) {
            this.state.bugServicePropertiesMap[payload.issueFilingServiceName] = {};
        }

        this.state.bugServicePropertiesMap[payload.issueFilingServiceName][payload.propertyName] =
            payload.propertyValue;

        this.saveAndEmitChanged();
    };

    private onSaveIssueSettings = (payload: SaveIssueFilingSettingsPayload): void => {
        const bugService = payload.issueFilingServiceName;
        this.state.bugService = bugService;
        this.state.bugServicePropertiesMap[bugService] = payload.issueFilingSettings;
        this.saveAndEmitChanged();
    };

    private onSaveLastWindowBounds = (payload: SaveWindowBoundsPayload): void => {
        this.state.lastWindowState = payload.windowState;

        // Retain these bounds only if the window is in a normal state
        if (payload.windowState === 'normal') {
            this.state.lastWindowBounds = payload.windowBounds;
        }

        this.saveAndEmitChanged();
    };

    private onSetAutoDetectedFailuresDialogState = (
        payload: AutoDetectedFailuresDialogStatePayload,
    ): void => {
        this.state.showAutoDetectedFailuresDialog = payload.enabled;

        this.saveAndEmitChanged();
    };

    private saveAndEmitChanged(): void {
        this.indexDbApi
            .setItem(IndexedDBDataKeys.userConfiguration, this.state)
            .catch(this.logger.error);

        this.emitChanged();
    }
}
