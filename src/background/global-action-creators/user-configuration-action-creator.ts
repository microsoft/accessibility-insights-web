// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveAssessmentDialogStatePayload,
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

    public getUserConfigurationState = async (): Promise<void> =>
        await this.userConfigActions.getCurrentState.invoke();

    public setTelemetryState = async (enableTelemetry: boolean): Promise<void> =>
        await this.userConfigActions.setTelemetryState.invoke(enableTelemetry);

    public setHighContrastMode = async (payload: SetHighContrastModePayload): Promise<void> =>
        await this.userConfigActions.setHighContrastMode.invoke(payload);

    public setNativeHighContrastMode = async (
        payload: SetNativeHighContrastModePayload,
    ): Promise<void> => await this.userConfigActions.setNativeHighContrastMode.invoke(payload);

    public setIssueFilingService = async (payload: SetIssueFilingServicePayload): Promise<void> =>
        await this.userConfigActions.setIssueFilingService.invoke(payload);

    public setIssueFilingServiceProperty = async (
        payload: SetIssueFilingServicePropertyPayload,
    ): Promise<void> => await this.userConfigActions.setIssueFilingServiceProperty.invoke(payload);

    public saveIssueFilingSettings = async (
        payload: SaveIssueFilingSettingsPayload,
    ): Promise<void> => await this.userConfigActions.saveIssueFilingSettings.invoke(payload);

    public setAdbLocation = async (adbLocation: string): Promise<void> =>
        await this.userConfigActions.setAdbLocation.invoke(adbLocation, this.currentScope);

    public saveWindowBounds = async (payload: SaveWindowBoundsPayload): Promise<void> =>
        await this.userConfigActions.saveWindowBounds.invoke(payload);

    public setAutoDetectedFailuresDialogState = async (
        payload: AutoDetectedFailuresDialogStatePayload,
    ): Promise<void> => {
        await this.userConfigActions.setAutoDetectedFailuresDialogState.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SET_AUTO_DETECTED_FAILURES_DIALOG_STATE,
            payload,
        );
    };

    public setSaveAssessmentDialogState = async (
        payload: SaveAssessmentDialogStatePayload,
    ): Promise<void> => {
        await this.userConfigActions.setSaveAssessmentDialogState.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.SET_SAVE_ASSESSMENT_DIALOG_STATE,
            payload,
        );
    };
}
