// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { AutoDetectedFailuresDialogSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/auto-detected-failures-dialog/auto-detected-failures-dialog-settings';
import { SaveAssessmentDialogSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/save-assessment-dialog/save-assessment-dialog-settings';
import { createTelemetrySettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/telemetry/telemetry-settings';
import { HighContrastSettings } from './high-contrast/high-contrast-settings';
import { IssueFilingSettings } from './issue-filing/issue-filing-settings';
import { createSettingsProvider } from './settings-provider';

export const ExtensionSettingsProvider = createSettingsProvider([
    createTelemetrySettings(title),
    HighContrastSettings,
    AutoDetectedFailuresDialogSettings,
    SaveAssessmentDialogSettings,
    IssueFilingSettings,
]);
