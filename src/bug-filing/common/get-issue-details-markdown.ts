// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueUrlCreationUtils } from './issue-filing-url-string-utils';

export const getIssueDetailsMarkdown = (
    stringUtils: IssueUrlCreationUtils,
    environmentInfo: EnvironmentInfo,
    data: CreateIssueDetailsTextData,
): string => {
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
        `${stringUtils.formatAsMarkdownCodeBlock(result.failureSummary)}`,
        ``,
        `**Environment**:`,
        `${environmentInfo.browserSpec}`,
        ``,
        `====`,
        ``,
        stringUtils.getFooterContent(environmentInfo),
    ].join('\n');

    return text;
};
