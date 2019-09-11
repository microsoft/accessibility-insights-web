// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { ReactFCWithDisplayName } from './../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

export type IssueFilingUrlProvider<Settings> = (
    data: Settings,
    issueData: CreateIssueDetailsTextData,
    environmentInfo: EnvironmentInfo,
) => string;

export interface IssueFilingService<Settings = {}> {
    key: string;
    isHidden?: boolean;
    displayName: string;
    settingsForm: ReactFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    getSettingsFromStoreData: (data: IssueFilingServicePropertiesMap) => Settings;
    fileIssue: (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ) => void;
}
