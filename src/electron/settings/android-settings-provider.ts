// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createSettingsProvider } from 'DetailsView/components/settings-panel/settings/settings-provider';
import { TelemetrySettings } from 'DetailsView/components/settings-panel/settings/telemetry/telemetry-settings';

export const AndroidSettingsProvider = createSettingsProvider([TelemetrySettings]);
