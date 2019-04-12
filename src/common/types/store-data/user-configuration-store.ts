// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface UserConfigurationStoreData {
    isFirstTime: boolean;
    enableTelemetry: boolean;
    enableHighContrast: boolean;
    issueTrackerPath?: string;
    bugService: string;
    bugServicePropertiesMap: BugServicePropertiesMap;
}

export interface BugServicePropertiesMap {
    [service: string]: BugServiceProperties;
}

export type BugServiceProperties = Object;
