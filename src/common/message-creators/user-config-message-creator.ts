// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveAssessmentDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SetAdbLocationPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { Messages } from '../messages';

export class UserConfigMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly telemetryFactory: TelemetryDataFactory,
    ) {}
    public setTelemetryState(enableTelemetry: boolean): void {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        });
    }

    public setHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        });
    }

    public setNativeHighContrastMode(enableHighContrast: boolean): void {
        const payload: SetNativeHighContrastModePayload = {
            enableHighContrast,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetNativeHighContrastConfig,
            payload,
        });
    }

    public setIssueFilingService = (payload: SetIssueFilingServicePayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingService,
            payload,
        });
    };

    public setIssueFilingServiceProperty = (payload: SetIssueFilingServicePropertyPayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
            payload,
        });
    };

    public saveIssueFilingSettings = (payload: SaveIssueFilingSettingsPayload) => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        });
    };

    public setAdbLocation(adbLocation: string): void {
        const payload: SetAdbLocationPayload = {
            adbLocation,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetAdbLocationConfig,
            payload,
        });
    }

    public setAutoDetectedFailuresDialogState(showDialog: boolean): void {
        const telemetry = this.telemetryFactory.forSetAutoDetectedFailuresDialogState(showDialog);
        const payload: AutoDetectedFailuresDialogStatePayload = {
            enabled: showDialog,
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetAutoDetectedFailuresDialogState,
            payload,
        });
    }

    public setSaveAssessmentDialogState(showDialog: boolean): void {
        const telemetry = this.telemetryFactory.forSetShowAssessmentDialogState(showDialog);
        const payload: SaveAssessmentDialogStatePayload = {
            enabled: showDialog,
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: Messages.UserConfig.SetSaveAssessmentDialogState,
            payload,
        });
    }
}
