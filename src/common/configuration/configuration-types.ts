// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type InsightsConfiguration = {
    options: InsightsConfigurationOptions;
};
export type InsightsConfigurationOptions = {
    fullName?: string;
    icon16?: string;
    icon48?: string;
    icon128?: string;
    appInsightsInstrumentationKey?: string;
    bundled?: string;
    telemetryBuildName?: string;
};
