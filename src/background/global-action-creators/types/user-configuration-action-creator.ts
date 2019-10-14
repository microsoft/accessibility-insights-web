// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';

export interface UserConfigurationActionCreator {
    setTelemetryState(payload: SetTelemetryStatePayload): void;

    setHighContrastMode(payload: SetHighContrastModePayload): void;

    setIssueFilingService(payload: SetIssueFilingServicePayload): void;

    setIssueFilingServiceProperty(payload: SetIssueFilingServicePropertyPayload): void;

    saveIssueFilingSettings(payload: SaveIssueFilingSettingsPayload): void;
}
