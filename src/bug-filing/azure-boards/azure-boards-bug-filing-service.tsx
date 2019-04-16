// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { BugFilingService } from '../types/bug-filing-service';
import { AzureBoardsSettingsForm } from './azure-boards-settings-form';
import { createSettingsGetter } from '../common/create-settings-getter';

const AzureBoardsBugFilingServiceKey = 'azureBoards';

export type AzureBoardsIssueDetailField = 'reproSteps' | 'description';

export interface AzureBoardsIssueDetailLocationDropdownOption extends IDropdownOption {
    key: AzureBoardsIssueDetailField;
}

export type AzureBoardsBugFilingSettings = {
    projectURL: string;
    issueDetailsField: AzureBoardsIssueDetailField;
};

function buildStoreData(projectURL: string, issueDetailsField: AzureBoardsIssueDetailField): AzureBoardsBugFilingSettings {
    return {
        projectURL,
        issueDetailsField,
    };
}

function isSettingsValid(data: AzureBoardsBugFilingSettings): boolean {
    return !isEmpty(data) && isStringValid(data.projectURL) && isStringValid(data.issueDetailsField);
}

function isStringValid(stringToCheck: string): boolean {
    return !isEmpty(stringToCheck) && !isEmpty(stringToCheck.trim());
}

export const AzureBoardsBugFilingService: BugFilingService<AzureBoardsBugFilingSettings> = {
    key: AzureBoardsBugFilingServiceKey,
    displayName: 'Azure Boards',
    settingsForm: AzureBoardsSettingsForm,
    buildStoreData,
    getSettingsFromStoreData: createSettingsGetter(AzureBoardsBugFilingServiceKey),
    isSettingsValid,
    issueFilingUrlProvider: (data: AzureBoardsBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo) =>
        null,
};
