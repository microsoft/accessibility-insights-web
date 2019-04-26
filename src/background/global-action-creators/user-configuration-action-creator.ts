// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import {
    SaveIssueFilingSettingsPayload,
    SetBugServicePayload,
    SetBugServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../actions/action-payloads';
import { UserConfigurationActions } from '../actions/user-configuration-actions';
import { Interpreter } from '../interpreter';

export class UserConfigurationActionCreator {
    constructor(private readonly interpreter: Interpreter, private readonly userConfigActions: UserConfigurationActions) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.GetCurrentState, this.onGetUserConfigState);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetTelemetryConfig, this.onSetTelemetryConfiguration);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetHighContrastConfig, this.onSetHighContrastMode);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetBugService, this.onSetBugService);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetBugServiceProperty, this.onSetBugServiceProperty);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueTrackerPath, this.onSetIssueTrackerPath);
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

    private onSetBugService = (payload: SetBugServicePayload): void => {
        this.userConfigActions.setBugService.invoke(payload);
    };

    private onSetBugServiceProperty = (payload: SetBugServicePropertyPayload): void => {
        this.userConfigActions.setBugServiceProperty.invoke(payload);
    };

    private onSetIssueTrackerPath = (payload: SetIssueTrackerPathPayload): void => {
        this.userConfigActions.setIssueTrackerPath.invoke(payload);
    };

    private onSaveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload): void => {
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
    };
}
