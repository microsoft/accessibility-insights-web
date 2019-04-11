// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils } from './../common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './github-bug-filing-service';

export function createGitHubBugFilingUrl(
    settingsData: GitHubBugFilingSettings,
    bugData: CreateIssueDetailsTextData,
    environmentInfo: EnvironmentInfo,
): string {
    function buildTitle(data: CreateIssueDetailsTextData): string {
        const standardTags = IssueFilingUrlStringUtils.standardizeTags(data);
        let prefix = standardTags.join(',');
        if (prefix.length > 0) {
            prefix = prefix + ': ';
        }

        const selectorLastPart = IssueFilingUrlStringUtils.getSelectorLastPart(data.ruleResult.selector);

        return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
    }

    function buildGithubText(data: CreateIssueDetailsTextData): string {
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
            `    ${IssueFilingUrlStringUtils.collapseConsecutiveSpaces(result.snippet)}`,
            ``,
            `**How to fix**:`,
            ``,
            `${IssueFilingUrlStringUtils.markdownEscapeBlock(result.failureSummary)}`,
            ``,
            `**Environment**:`,
            `${environmentInfo.browserSpec}`,
            ``,
            `====`,
            ``,
            IssueFilingUrlStringUtils.footer(environmentInfo),
        ].join('\n');

        return text;
    }

    const title = buildTitle(bugData);
    const body = buildGithubText(bugData);
    const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    return `${settingsData.repository}${encodedIssue}`;
}
