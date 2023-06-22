// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveAssessmentDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
} from './action-payloads';

export class UserConfigurationActions {
    public readonly setTelemetryState = new AsyncAction<boolean>();
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly setHighContrastMode = new AsyncAction<SetHighContrastModePayload>();
    public readonly setNativeHighContrastMode = new AsyncAction<SetHighContrastModePayload>();
    public readonly setIssueFilingService = new AsyncAction<SetIssueFilingServicePayload>();
    public readonly setIssueFilingServiceProperty =
        new AsyncAction<SetIssueFilingServicePropertyPayload>();
    public readonly saveIssueFilingSettings = new AsyncAction<SaveIssueFilingSettingsPayload>();
    public readonly saveWindowBounds = new AsyncAction<SaveWindowBoundsPayload>();
    public readonly setAutoDetectedFailuresDialogState =
        new AsyncAction<AutoDetectedFailuresDialogStatePayload>();
    public readonly setSaveAssessmentDialogState =
        new AsyncAction<SaveAssessmentDialogStatePayload>();
}
