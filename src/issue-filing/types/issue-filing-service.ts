// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { OpenIssueLink } from 'issue-filing/common/create-file-issue-handler';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import {
    IssueFilingServiceProperties,
    IssueFilingServicePropertiesMap,
} from '../../common/types/store-data/user-configuration-store';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

export type IssueFilingUrlProvider<Settings> = (
    data: Settings,
    issueData: CreateIssueDetailsTextData,
    toolData: ToolData,
) => string;

export interface IssueFilingService {
    key: string;
    isHidden?: boolean;
    displayName: string;
    settingsForm: ReactFCWithDisplayName<SettingsFormProps<any>>;
    buildStoreData: (...params: any[]) => IssueFilingServiceProperties;
    isSettingsValid: (data: IssueFilingServiceProperties) => boolean;
    getSettingsFromStoreData: (
        data: IssueFilingServicePropertiesMap,
    ) => IssueFilingServiceProperties;
    fileIssue: (
        openIssueLink: OpenIssueLink,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ) => Promise<void>;
}

export interface IssueFilingServiceWithSettings<Settings extends IssueFilingServiceProperties>
    extends IssueFilingService {
    settingsForm: ReactFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    getSettingsFromStoreData: (data: IssueFilingServicePropertiesMap) => Settings;
}
