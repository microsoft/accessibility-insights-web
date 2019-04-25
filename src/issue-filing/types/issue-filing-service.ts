// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { ReactSFCWithDisplayName } from './../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

export type IssueFilingUrlProvider<Settings> = (
    data: Settings,
    bugData: CreateIssueDetailsTextData,
    environmentInfo: EnvironmentInfo,
) => string;

export interface IssueFilingService<Settings = {}> {
    key: string;
    isHidden?: boolean;
    displayName: string;
    settingsForm: ReactSFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    getSettingsFromStoreData: (data: BugServicePropertiesMap) => Settings;
    issueFilingUrlProvider: IssueFilingUrlProvider<Settings>;
}
