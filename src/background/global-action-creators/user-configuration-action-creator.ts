// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from '../actions/action-payloads';
import { UserConfigurationActions } from '../actions/user-configuration-actions';
import { Interpreter } from '../interpreter';

export class UserConfigurationActionCreator {
    constructor(private readonly interpreter: Interpreter, private readonly userConfigActions: UserConfigurationActions) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.UserConfigurationStore), this.onGetUserConfigState);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetTelemetryConfig, this.onSetTelemetryConfiguration);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetHighContrastConfig, this.onSetHighContrastMode);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueFilingService, this.onSetBugService);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueFilingServiceProperty, this.onSetBugServiceProperty);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SaveIssueFilingSettings, this.onSaveIssueFilingSettings);
    }

    private onGetUserConfigState = (): void => {
        this.userConfigActions.getCurrentState.invoke(null);
    };

    private onSetTelemetryConfiguration = (payload: SetTelemetryStatePayload): void => {
        this.userConfigActions.setTelemetryState.invoke(payload);
    };

    private onSetHighContrastMode = (payload: SetHighContrastModePayload): void => {
        this.userConfigActions.setHighContrastMode.invoke(payload);
    };

    private onSetBugService = (payload: SetIssueFilingServicePayload): void => {
        this.userConfigActions.setIssueFilingService.invoke(payload);
    };

    private onSetBugServiceProperty = (payload: SetIssueFilingServicePropertyPayload): void => {
        this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);
    };

    private onSaveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload): void => {
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
    };
}
