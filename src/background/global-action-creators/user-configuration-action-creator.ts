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

    private getUserConfigurationState = (): void => {
        this.userConfigActions.getCurrentState.invoke(null);
    };

    private setTelemetryState = (payload: SetTelemetryStatePayload): void => {
        this.userConfigActions.setTelemetryState.invoke(payload);
    };

    private setHighContrastMode = (payload: SetHighContrastModePayload): void => {
        this.userConfigActions.setHighContrastMode.invoke(payload);
    };

    private setIssueFilingService = (payload: SetIssueFilingServicePayload): void => {
        this.userConfigActions.setIssueFilingService.invoke(payload);
    };

    private setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload): void => {
        this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);
    };

    private saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload): void => {
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);
    };
}
