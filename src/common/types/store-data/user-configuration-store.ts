// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface UserConfigurationStoreData {
    isFirstTime: boolean;
    enableTelemetry: boolean;
    enableHighContrast: boolean;
    bugService: string;
    bugServicePropertiesMap: IssueFilingServicePropertiesMap;
}

export interface IssueFilingServicePropertiesMap {
    [service: string]: IssueFilingServiceProperties;
}

export type IssueFilingServiceProperties = Object;
