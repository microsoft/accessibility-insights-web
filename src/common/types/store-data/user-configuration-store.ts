// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface UserConfigurationStoreData {
    isFirstTime: boolean;
    enableTelemetry: boolean;
    enableHighContrast: boolean;
    issueTrackerPath?: string;
    bugService: string;
    bugServicePropertiesMap: IssueServicePropertiesMap;
}

export interface IssueServicePropertiesMap {
    [service: string]: IssueFilingServiceProperties;
}

export type IssueFilingServiceProperties = Object;
