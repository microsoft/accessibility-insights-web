// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AzureBoardsBugFilingService } from './azure-boards/azure-boards-issue-filing-service';
import { BugFilingServiceProvider } from './issue-filing-service-provider';
import { GitHubBugFilingService } from './github/github-issue-filing-service';
import { NullIssueFilingService } from './null-issue-filing-service/null-issue-filing-service';

export const BugFilingServiceProviderImpl = new BugFilingServiceProvider([
    NullIssueFilingService,
    GitHubBugFilingService,
    AzureBoardsBugFilingService,
]);
