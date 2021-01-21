// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsBuilder } from 'issue-filing/common/issue-details-builder';
import { isEmpty } from 'lodash';
import { IDropdownOption } from 'office-ui-fabric-react';

import { createFileIssueHandler } from '../../common/create-file-issue-handler';
import { createSettingsGetter } from '../../common/create-settings-getter';
import { IssueFilingServiceWithSettings } from '../../types/issue-filing-service';
import {
    AzureBoardsIssueDetailField,
    AzureBoardsIssueFilingSettings,
} from './azure-boards-issue-filing-settings';
import { AzureBoardsSettingsForm } from './azure-boards-settings-form';
import { azureBoardsIssueFilingUrlProvider } from './create-azure-boards-issue-filing-url';

export const AzureBoardsIssueFilingServiceKey = 'azureBoards';

export interface AzureBoardsIssueDetailLocationDropdownOption extends IDropdownOption {
    key: AzureBoardsIssueDetailField;
}

function buildStoreData(
    projectURL: string,
    issueDetailsField: AzureBoardsIssueDetailField,
): AzureBoardsIssueFilingSettings {
    return {
        projectURL,
        issueDetailsField,
    };
}

function isSettingsValid(data: AzureBoardsIssueFilingSettings): boolean {
    return (
        !isEmpty(data) && isStringValid(data.projectURL) && isStringValid(data.issueDetailsField)
    );
}

function isStringValid(stringToCheck: string): boolean {
    return !isEmpty(stringToCheck) && !isEmpty(stringToCheck.trim());
}

const settingsGetter = createSettingsGetter<AzureBoardsIssueFilingSettings>(
    AzureBoardsIssueFilingServiceKey,
);

export function getAzureBoardsIssueFilingService(
    issueDetailsBuilder: IssueDetailsBuilder,
): IssueFilingServiceWithSettings<AzureBoardsIssueFilingSettings> {
    return {
        key: AzureBoardsIssueFilingServiceKey,
        displayName: 'Azure Boards',
        settingsForm: AzureBoardsSettingsForm,
        buildStoreData,
        getSettingsFromStoreData: settingsGetter,
        isSettingsValid,
        fileIssue: createFileIssueHandler(
            azureBoardsIssueFilingUrlProvider(issueDetailsBuilder),
            settingsGetter,
        ),
    };
}
