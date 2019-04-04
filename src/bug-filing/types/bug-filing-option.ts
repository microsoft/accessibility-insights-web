// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface BugFilingOption<Settings = {}> {
    key: string;
    displayName: string;
    renderSettingsForm: React.SFC;
    buildStoreData: (params?: any) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    fileBug: (data: Settings) => void;
}
