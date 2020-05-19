// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { androidAppTitle } from 'content/strings/application';
import { HighContrastSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/high-contrast/high-contrast-settings';
import { createSettingsProvider } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-provider';
import { createTelemetrySettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/telemetry/telemetry-settings';
import { IssueFilingSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/issue-filing/issue-filing-settings';

export const UnifiedSettingsProvider = createSettingsProvider([
    createTelemetrySettings(androidAppTitle),
    HighContrastSettings,
    IssueFilingSettings,
]);
