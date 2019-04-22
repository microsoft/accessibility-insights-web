// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createIssueDetailsBuilder } from '../common/issue-details-builder';
import { IssueDetailsGetter } from '../common/issue-details-getter';
import { MarkdownFactory } from '../common/markdown-factory';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from './../common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './github-bug-filing-service';

export const createGitHubIssueFilingUrlProvider = (stringUtils: IssueUrlCreationUtils, issueDetailsGetter: IssueDetailsGetter) => {
    return (settingsData: GitHubBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo): string => {
        const title = stringUtils.getTitle(bugData);
        const body = issueDetailsGetter(stringUtils, environmentInfo, bugData);
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        const repository = stringUtils.appendSuffixToUrl(settingsData.repository, 'issues');
        return `${repository}${encodedIssue}`;
    };
};

export const gitHubIssueFilingUrlProvider = createGitHubIssueFilingUrlProvider(
    IssueFilingUrlStringUtils,
    createIssueDetailsBuilder(MarkdownFactory),
);
