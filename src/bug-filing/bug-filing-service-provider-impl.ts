// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AzureDevOpsBugFilingService } from './azure-devops/azure-devops-bug-filing-service';
import { BugFilingServiceProvider } from './bug-filing-service-provider';
import { GitHubBugFilingService } from './github/github-bug-filing-service';
import { NullIssueFilingService } from './null-issue-filing-service/null-issue-filing-service';

export const BugFilingServiceProviderImpl = new BugFilingServiceProvider([
    NullIssueFilingService,
    GitHubBugFilingService,
    AzureDevOpsBugFilingService,
]);
