// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistentStore } from 'common/flux/persistent-store';
import { Logger } from 'common/logging/logger';
import { cloneDeep, isPlainObject } from 'lodash';
import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveAssessmentDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from '../../actions/action-payloads';
import { UserConfigurationActions } from '../../actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../IndexedDBDataKeys';

export class UserConfigurationStore extends PersistentStore<UserConfigurationStoreData> {
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
        showSaveAssessmentDialog: true,
    };

    constructor(
        persistedState: UserConfigurationStoreData,
        private readonly userConfigActions: UserConfigurationActions,
        indexDbApi: IndexedDBAPI,
        logger: Logger,
    ) {
        super(
            StoreNames.UserConfigurationStore,
            persistedState,
            indexDbApi,
            IndexedDBDataKeys.userConfiguration,
            logger,
        );
    }

    protected override generateDefaultState(
        persistedData: UserConfigurationStoreData,
    ): UserConfigurationStoreData {
        const persistedState = cloneDeep(persistedData);
        const defaultState = cloneDeep(UserConfigurationStore.defaultState);
        return Object.assign(defaultState, persistedState);
    }

    public override getDefaultState(): UserConfigurationStoreData {
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
        this.userConfigActions.setSaveAssessmentDialogState.addListener(
            this.onSetSaveAssessmentDialogState,
        );
    }

    private onSetAdbLocation = async (location: string): Promise<void> => {
        this.state.adbLocation = location;
        await this.emitChanged();
    };

    private onSetTelemetryState = async (enableTelemetry: boolean): Promise<void> => {
        this.state.isFirstTime = false;
        this.state.enableTelemetry = enableTelemetry;
        await this.emitChanged();
    };

    private onSetHighContrastMode = async (payload: SetHighContrastModePayload): Promise<void> => {
        this.state.enableHighContrast = payload.enableHighContrast;
        this.state.lastSelectedHighContrast = payload.enableHighContrast;
        await this.emitChanged();
    };

    private onSetNativeHighContrastMode = async (
        payload: SetNativeHighContrastModePayload,
    ): Promise<void> => {
        this.state.enableHighContrast = payload.enableHighContrast
            ? true
            : this.state.lastSelectedHighContrast;
        await this.emitChanged();
    };

    private onSetIssueFilingService = async (
        payload: SetIssueFilingServicePayload,
    ): Promise<void> => {
        this.state.bugService = payload.issueFilingServiceName;
        await this.emitChanged();
    };

    private onSetIssueFilingServiceProperty = async (
        payload: SetIssueFilingServicePropertyPayload,
    ): Promise<void> => {
        if (!isPlainObject(this.state.bugServicePropertiesMap)) {
            this.state.bugServicePropertiesMap = {};
        }
        if (!isPlainObject(this.state.bugServicePropertiesMap[payload.issueFilingServiceName])) {
            this.state.bugServicePropertiesMap[payload.issueFilingServiceName] = {};
        }

        this.state.bugServicePropertiesMap[payload.issueFilingServiceName][payload.propertyName] =
            payload.propertyValue;

        await this.emitChanged();
    };

    private onSaveIssueSettings = async (
        payload: SaveIssueFilingSettingsPayload,
    ): Promise<void> => {
        const bugService = payload.issueFilingServiceName;
        this.state.bugService = bugService;
        this.state.bugServicePropertiesMap[bugService] = payload.issueFilingSettings;
        await this.emitChanged();
    };

    private onSaveLastWindowBounds = async (payload: SaveWindowBoundsPayload): Promise<void> => {
        this.state.lastWindowState = payload.windowState;

        // Retain these bounds only if the window is in a normal state
        if (payload.windowState === 'normal') {
            this.state.lastWindowBounds = payload.windowBounds;
        }

        await this.emitChanged();
    };

    private onSetAutoDetectedFailuresDialogState = async (
        payload: AutoDetectedFailuresDialogStatePayload,
    ): Promise<void> => {
        this.state.showAutoDetectedFailuresDialog = payload.enabled;

        await this.emitChanged();
    };

    private onSetSaveAssessmentDialogState = async (
        payload: SaveAssessmentDialogStatePayload,
    ): Promise<void> => {
        this.state.showSaveAssessmentDialog = payload.enabled;
        await this.emitChanged();
    };
}
