// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AzureBoardsIssueFilingService } from './azure-boards/azure-boards-issue-filing-service';
import { IssueFilingServiceProvider } from './issue-filing-service-provider';
import { GitHubIssueFilingService } from './github/github-issue-filing-service';
import { NullIssueFilingService } from './null-issue-filing-service/null-issue-filing-service';

export const IssueFilingServiceProviderImpl = new IssueFilingServiceProvider([
    NullIssueFilingService,
    GitHubIssueFilingService,
    AzureBoardsIssueFilingService,
]);
