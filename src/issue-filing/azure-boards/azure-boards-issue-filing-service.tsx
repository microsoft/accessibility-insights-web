// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { createSettingsGetter } from '../common/create-settings-getter';
import { IssueFilingService } from '../types/issue-filing-service';
import { AzureBoardsSettingsForm } from './azure-boards-settings-form';
import { azureBoardsIssueFilingUrlProvider } from './create-azure-boards-issue-filing-url';

const AzureBoardsIssueFilingServiceKey = 'azureBoards';

export type AzureBoardsIssueDetailField = 'reproSteps' | 'description';

export interface AzureBoardsIssueDetailLocationDropdownOption extends IDropdownOption {
    key: AzureBoardsIssueDetailField;
}

export type AzureBoardsIssueFilingSettings = {
    projectURL: string;
    issueDetailsField: AzureBoardsIssueDetailField;
};

function buildStoreData(projectURL: string, issueDetailsField: AzureBoardsIssueDetailField): AzureBoardsIssueFilingSettings {
    return {
        projectURL,
        issueDetailsField,
    };
}

function isSettingsValid(data: AzureBoardsIssueFilingSettings): boolean {
    return !isEmpty(data) && isStringValid(data.projectURL) && isStringValid(data.issueDetailsField);
}

function isStringValid(stringToCheck: string): boolean {
    return !isEmpty(stringToCheck) && !isEmpty(stringToCheck.trim());
}

export const AzureBoardsIssueFilingService: IssueFilingService<AzureBoardsIssueFilingSettings> = {
    key: AzureBoardsIssueFilingServiceKey,
    displayName: 'Azure Boards',
    settingsForm: AzureBoardsSettingsForm,
    buildStoreData,
    getSettingsFromStoreData: createSettingsGetter(AzureBoardsIssueFilingServiceKey),
    isSettingsValid,
    issueFilingUrlProvider: azureBoardsIssueFilingUrlProvider,
};
