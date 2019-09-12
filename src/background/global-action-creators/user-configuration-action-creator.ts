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
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.UserConfigurationStore),
            this.getUserConfigurationState,
        );
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetTelemetryConfig, this.setTelemetryState);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetHighContrastConfig, this.setHighContrastMode);
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SetIssueFilingService, this.setIssueFilingService);
        this.interpreter.registerTypeToPayloadCallback(
            Messages.UserConfig.SetIssueFilingServiceProperty,
            this.setIssueFilingServiceProperty,
        );
        this.interpreter.registerTypeToPayloadCallback(Messages.UserConfig.SaveIssueFilingSettings, this.saveIssueFilingSettings);
    }

    public getUserConfigurationState = (): void => {
        this.userConfigActions.getCurrentState.invoke(null);
    };

    public setTelemetryState = (payload: SetTelemetryStatePayload): void => {
        this.userConfigActions.setTelemetryState.invoke(payload);
    };

    public setHighContrastMode = (payload: SetHighContrastModePayload): void => {
        this.userConfigActions.setHighContrastMode.invoke(payload);
    };

    public setIssueFilingService = (payload: SetIssueFilingServicePayload): void => {
        this.userConfigActions.setIssueFilingService.invoke(payload);
    };

    public setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload): void => {
        this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);
    };

    public saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload): void => {
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
    };
}
