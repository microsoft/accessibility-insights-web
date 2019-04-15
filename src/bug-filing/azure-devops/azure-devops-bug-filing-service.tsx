// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import { IDropdownOption } from 'office-ui-fabric-react';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { BugFilingService } from '../types/bug-filing-service';
import { AzureDevOpsSettingsForm } from './azure-devops-settings-form';

const AzureDevOpsBugFilingServiceKey = 'azureDevOps';

export type AzureDevOpsIssueDetailLocation = 'reproSteps' | 'description';

export interface AzureDevOpsIssueDetailLocationDropdownOption extends IDropdownOption {
    key: AzureDevOpsIssueDetailLocation;
}

export type AzureDevOpsBugFilingSettings = {
    projectURL: string;
    issueDetailsLocationField: AzureDevOpsIssueDetailLocation;
};

function buildStoreData(projectURL: string, issueDetailsLocationField: AzureDevOpsIssueDetailLocation): AzureDevOpsBugFilingSettings {
    return {
        projectURL,
        issueDetailsLocationField,
    };
}

function getSettingsFromStoreData(bugServicePropertiesMap: BugServicePropertiesMap): AzureDevOpsBugFilingSettings {
    return bugServicePropertiesMap[AzureDevOpsBugFilingServiceKey] as AzureDevOpsBugFilingSettings;
}

function isSettingsValid(data: AzureDevOpsBugFilingSettings): boolean {
    return !isEmpty(data) && isStringValid(data.projectURL) && isStringValid(data.issueDetailsLocationField);
}

function isStringValid(stringToCheck: string): boolean {
    return !isEmpty(stringToCheck) && !isEmpty(stringToCheck.trim());
}

export const AzureDevOpsBugFilingService: BugFilingService<AzureDevOpsBugFilingSettings> = {
    key: AzureDevOpsBugFilingServiceKey,
    displayName: 'Azure DevOps',
    settingsForm: AzureDevOpsSettingsForm,
    buildStoreData,
    getSettingsFromStoreData,
    isSettingsValid,
    createBugFilingUrl: (data: AzureDevOpsBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo) => null,
};
