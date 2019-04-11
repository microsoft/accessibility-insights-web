// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { ReactSFCWithDisplayName } from './../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

export interface BugFilingService<Settings = {}> {
    key: string;
    displayName: string;
    renderSettingsForm: ReactSFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    createBugFilingUrl: (data: Settings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo) => string;
}
