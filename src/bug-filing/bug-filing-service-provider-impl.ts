// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingServiceProvider } from './bug-filing-service-provider';
import { GitHubBugFilingService } from './github/github-bug-filing-service';
import { NullIssueFilingService } from './null-issue-filing-service/null-issue-filing-service';
import { AzureBoardsBugFilingService } from './azure-boards/azure-boards-bug-filing-service';

export const BugFilingServiceProviderImpl = new BugFilingServiceProvider([
    NullIssueFilingService,
    GitHubBugFilingService,
    AzureBoardsBugFilingService,
]);
