// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from './../common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './github-bug-filing-service';

function buildTitle(stringUtils: IssueUrlCreationUtils, data: CreateIssueDetailsTextData): string {
    const standardTags = stringUtils.standardizeTags(data);
    let prefix = standardTags.join(',');
    if (prefix.length > 0) {
        prefix = prefix + ': ';
    }

    const selectorLastPart = stringUtils.getSelectorLastPart(data.ruleResult.selector);

    return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
}

function buildGithubText(stringUtils: IssueUrlCreationUtils, environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string {
    const result = data.ruleResult;

    const text = [
        `**Issue**: \`${result.help}\` ([\`${result.ruleId}\`](${result.helpUrl}))`,
        ``,
        `**Target application**: [${data.pageTitle}](${data.pageUrl})`,
        ``,
        `**Element path**: ${data.ruleResult.selector}`,
        ``,
        `**Snippet**:`,
        ``,
        `    ${stringUtils.collapseConsecutiveSpaces(result.snippet)}`,
        ``,
        `**How to fix**:`,
        ``,
        `${stringUtils.markdownEscapeBlock(result.failureSummary)}`,
        ``,
        `**Environment**:`,
        `${environmentInfo.browserSpec}`,
        ``,
        `====`,
        ``,
        stringUtils.footer(environmentInfo),
    ].join('\n');

    return text;
}

export const createGitHubIssueFilingUrlProvider = (stringUtils: IssueUrlCreationUtils) => {
    return (settingsData: GitHubBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo): string => {
        const title = buildTitle(stringUtils, bugData);
        const body = buildGithubText(stringUtils, environmentInfo, bugData);
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${settingsData.repository}${encodedIssue}`;
    };
};

export const gitHubIssueFilingUrlProvider = createGitHubIssueFilingUrlProvider(IssueFilingUrlStringUtils);
