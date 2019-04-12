// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export interface IssueFilingStoreData {
    isIssueFilingSettingsDialogOpen: boolean;
    issueDetailsTextData: CreateIssueDetailsTextData;
}
