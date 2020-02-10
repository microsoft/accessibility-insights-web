// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighContrastSettings } from './high-contrast/high-contrast-settings';
import { IssueFilingSettings } from './issue-filing/issue-filing-settings';
import { createSettingsProvider } from './settings-provider';
import { TelemetrySettings } from './telemetry/telemetry-settings';

export const SettingsProviderImpl = createSettingsProvider([
    TelemetrySettings,
    HighContrastSettings,
    IssueFilingSettings,
]);
