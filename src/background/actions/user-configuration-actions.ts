// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import {
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
} from './action-payloads';

export class UserConfigurationActions {
    public readonly setAdbLocation = new Action<string>();
    public readonly setTelemetryState = new Action<boolean>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setNativeHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setIssueFilingService = new Action<SetIssueFilingServicePayload>();
    public readonly setIssueFilingServiceProperty =
        new Action<SetIssueFilingServicePropertyPayload>();
    public readonly saveIssueFilingSettings = new Action<SaveIssueFilingSettingsPayload>();
    public readonly saveWindowBounds = new Action<SaveWindowBoundsPayload>();
}
