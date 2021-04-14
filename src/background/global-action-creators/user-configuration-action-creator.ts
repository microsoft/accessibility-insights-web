// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from '../actions/action-payloads';
import { UserConfigurationActions } from '../actions/user-configuration-actions';

export class UserConfigurationActionCreator {
    private readonly currentScope: string = 'UserConfigurationActionCreator';

    constructor(private readonly userConfigActions: UserConfigurationActions) {}

    public getUserConfigurationState = () => this.userConfigActions.getCurrentState.invoke();

    public setTelemetryState = (enableTelemetry: boolean) =>
        this.userConfigActions.setTelemetryState.invoke(enableTelemetry);

    public setHighContrastMode = (payload: SetHighContrastModePayload) =>
        this.userConfigActions.setHighContrastMode.invoke(payload);

    public setNativeHighContrastMode = (payload: SetNativeHighContrastModePayload) =>
        this.userConfigActions.setNativeHighContrastMode.invoke(payload);

    public setIssueFilingService = (payload: SetIssueFilingServicePayload) =>
        this.userConfigActions.setIssueFilingService.invoke(payload);

    public setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload) =>
        this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);

    public saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload) =>
        this.userConfigActions.saveIssueFilingSettings.invoke(payload);

    public setAdbLocation = (adbLocation: string) =>
        this.userConfigActions.setAdbLocation.invoke(adbLocation, this.currentScope);

    public saveWindowBounds = (payload: SaveWindowBoundsPayload) =>
        this.userConfigActions.saveWindowBounds.invoke(payload);
}
