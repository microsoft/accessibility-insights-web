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

interface BugServicePropertiesMap {
    [service: string]: BugServiceProperties;
}

interface BugServiceProperties {
    [name: string]: string;
    issueTrackerPath?: string;
}
