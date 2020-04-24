// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import {
    SaveIssueFilingSettingsPayload,
    SaveLastWindowSizePayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
} from './action-payloads';

export class UserConfigurationActions {
    public readonly setTelemetryState = new Action<boolean>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setNativeHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setIssueFilingService = new Action<SetIssueFilingServicePayload>();
    public readonly setIssueFilingServiceProperty = new Action<
        SetIssueFilingServicePropertyPayload
    >();
    public readonly saveIssueFilingSettings = new Action<SaveIssueFilingSettingsPayload>();
    public readonly saveLastWindowSize = new Action<SaveLastWindowSizePayload>();
}
