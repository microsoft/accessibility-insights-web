// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface BugFilingOption<Settings = {}> {
    key: string;
    displayName: string;
    baseUrl: string;
    renderSettings: React.SFC;
    buildStoreData: (params?: any) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    buildBugFilingUrl: (data: Settings) => string;
    params: BugFilingParameter<Settings>[];
}

export type BugFilingParameter<Settings> = {
    key: keyof Settings;
    displayName: string;
    isRequired?: boolean;
    renderField: React.SFC;
};
