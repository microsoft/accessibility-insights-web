// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type InsightsConfiguration = {
    options: InsightsConfigurationOptions;
};
export type InsightsConfigurationOptions = {
    fullName: string;
    icon16: string;
    icon48: string;
    icon128: string;
    appInsightsInstrumentationKey?: string;
    bundled?: string;
    telemetryBuildName: string;
    unifiedAppVersion: string;
};

export interface ConfigAccessor {
    readonly config: InsightsConfiguration;
    getOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
    ): InsightsConfigurationOptions[K];
}

export interface ConfigMutator extends ConfigAccessor {
    reset(): ConfigMutator;
    setOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
        value: InsightsConfigurationOptions[K],
    ): ConfigMutator;
}
