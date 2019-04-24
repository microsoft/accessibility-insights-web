// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createIssueDetailsBuilder } from '../common/create-issue-details-builder';
import { HTTPQueryBuilder } from '../common/http-query-builder';
import { IssueDetailsBuilder } from '../common/issue-details-builder';
import { MarkdownFormatter } from '../common/markup/markdown-formatter';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from './../common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './github-bug-filing-service';

export const createGitHubIssueFilingUrlProvider = (
    stringUtils: IssueUrlCreationUtils,
    issueDetailsBuilder: IssueDetailsBuilder,
    queryBuilderProvider?: () => HTTPQueryBuilder,
) => {
    return (settingsData: GitHubBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo): string => {
        const title = stringUtils.getTitle(bugData);
        const body = issueDetailsBuilder(environmentInfo, bugData);

        const baseUrl = stringUtils.appendSuffixToUrl(settingsData.repository, 'issues');

        return queryBuilderProvider()
            .withBaseUrl(`${baseUrl}/new`)
            .withParam('title', title)
            .withParam('body', body)
            .build();
    };
};

export const gitHubIssueFilingUrlProvider = createGitHubIssueFilingUrlProvider(
    IssueFilingUrlStringUtils,
    createIssueDetailsBuilder(MarkdownFormatter),
    () => new HTTPQueryBuilder(),
);
