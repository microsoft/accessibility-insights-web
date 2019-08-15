// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type AzureBoardsIssueDetailField = 'reproSteps' | 'description';

export type AzureBoardsWorkItemType = 'Bug' | 'Issue';

export type AzureBoardsIssueFilingSettings = {
    projectURL: string;
    issueDetailsField: AzureBoardsIssueDetailField;
};
