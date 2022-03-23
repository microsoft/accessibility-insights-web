// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import {
    AutoDetectedFailuresDialogStatePayload,
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

    constructor(
        private readonly userConfigActions: UserConfigurationActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

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

    public setAutoDetectedFailuresDialogState = (
        payload: AutoDetectedFailuresDialogStatePayload,
    ) => {
        this.userConfigActions.setAutoDetectedFailuresDialogState.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SET_AUTO_DETECTED_FAILURES_DIALOG_STATE,
            payload,
        );
    };
}
