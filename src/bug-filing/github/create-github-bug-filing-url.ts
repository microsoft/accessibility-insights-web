// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getIssueDetailsMarkdown } from '../common/get-issue-details-markdown';
import { IssueDetailsGetter } from '../common/issue-details-getter';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from './../common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './github-bug-filing-service';

export function buildTitle(stringUtils: IssueUrlCreationUtils, data: CreateIssueDetailsTextData): string {
    const standardTags = stringUtils.standardizeTags(data);
    let prefix = standardTags.join(',');
    if (prefix.length > 0) {
        prefix = prefix + ': ';
    }

    const selectorLastPart = stringUtils.getSelectorLastPart(data.ruleResult.selector);

    return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
}

export const createGitHubIssueFilingUrlProvider = (stringUtils: IssueUrlCreationUtils, issueDetailsGetter: IssueDetailsGetter) => {
    return (settingsData: GitHubBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo): string => {
        const title = buildTitle(stringUtils, bugData);
        const body = issueDetailsGetter(stringUtils, environmentInfo, bugData);
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        const repository = stringUtils.appendSuffixToUrl(settingsData.repository, 'issues');
        return `${repository}${encodedIssue}`;
    };
};

export const gitHubIssueFilingUrlProvider = createGitHubIssueFilingUrlProvider(IssueFilingUrlStringUtils, getIssueDetailsMarkdown);
