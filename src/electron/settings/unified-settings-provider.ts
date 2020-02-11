// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { androidAppTitle } from 'content/strings/application';
import { createSettingsProvider } from 'DetailsView/components/settings-panel/settings/settings-provider';
import { createTelemetrySettings } from 'DetailsView/components/settings-panel/settings/telemetry/telemetry-settings';

export const UnifiedSettingsProvider = createSettingsProvider([
    createTelemetrySettings(androidAppTitle),
]);
