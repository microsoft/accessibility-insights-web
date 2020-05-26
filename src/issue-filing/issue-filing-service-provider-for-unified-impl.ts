// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createIssueDetailsBuilderForUnified } from 'issue-filing/common/create-issue-details-builder-for-unified';
import { HTMLFormatter } from 'issue-filing/common/markup/html-formatter';
import { MarkdownFormatter } from 'issue-filing/common/markup/markdown-formatter';
import { IssueFilingServiceProvider } from './issue-filing-service-provider';
import { getAzureBoardsIssueFilingService } from './services/azure-boards/azure-boards-issue-filing-service';
import { getGitHubIssueFilingService } from './services/github/github-issue-filing-service';
import { NullIssueFilingService } from './services/null-issue-filing-service/null-issue-filing-service';

export const IssueFilingServiceProviderForUnifiedImpl = new IssueFilingServiceProvider([
    NullIssueFilingService,
    getGitHubIssueFilingService(createIssueDetailsBuilderForUnified(MarkdownFormatter)),
    getAzureBoardsIssueFilingService(createIssueDetailsBuilderForUnified(HTMLFormatter)),
]);
