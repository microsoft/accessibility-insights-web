// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueServicePayload,
    SetIssueServicePropertyPayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from './action-payloads';

export class UserConfigurationActions {
    public readonly setTelemetryState = new Action<SetTelemetryStatePayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setIssueService = new Action<SetIssueServicePayload>();
    public readonly setIssueServiceProperty = new Action<SetIssueServicePropertyPayload>();
    public readonly setIssueTrackerPath = new Action<SetIssueTrackerPathPayload>();
    public readonly saveIssueFilingSettings = new Action<SaveIssueFilingSettingsPayload>();
}
