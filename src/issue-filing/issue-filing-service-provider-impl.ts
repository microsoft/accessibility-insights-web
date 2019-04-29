// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GitHubIssueFilingService } from './github/github-issue-filing-service';
import { IssueFilingServiceProvider } from './issue-filing-service-provider';
import { AzureBoardsIssueFilingService } from './services/azure-boards/azure-boards-issue-filing-service';
import { NullIssueFilingService } from './services/null-issue-filing-service/null-issue-filing-service';

export const IssueFilingServiceProviderImpl = new IssueFilingServiceProvider([
    NullIssueFilingService,
    GitHubIssueFilingService,
    AzureBoardsIssueFilingService,
]);
