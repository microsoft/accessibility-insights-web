// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
} from './action-payloads';

export class UserConfigurationActions {
    public readonly setAdbLocation = new SyncAction<string>();
    public readonly setTelemetryState = new SyncAction<boolean>();
    public readonly getCurrentState = new SyncAction<void>();
    public readonly setHighContrastMode = new SyncAction<SetHighContrastModePayload>();
    public readonly setNativeHighContrastMode = new SyncAction<SetHighContrastModePayload>();
    public readonly setIssueFilingService = new SyncAction<SetIssueFilingServicePayload>();
    public readonly setIssueFilingServiceProperty =
        new SyncAction<SetIssueFilingServicePropertyPayload>();
    public readonly saveIssueFilingSettings = new SyncAction<SaveIssueFilingSettingsPayload>();
    public readonly saveWindowBounds = new SyncAction<SaveWindowBoundsPayload>();
    public readonly setAutoDetectedFailuresDialogState =
        new SyncAction<AutoDetectedFailuresDialogStatePayload>();
}
