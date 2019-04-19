// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { escape } from 'lodash';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from '../../content/strings/application';
import { IssueUrlCreationUtils } from './issue-filing-url-string-utils';

const buildBodySection = (headingHtml: string, contentHtml: string): string => {
    return `<div><b>${headingHtml}</b></div><div>${contentHtml}</div><br>`;
};

const buildIssueDetails = (help: string, helpUrl: string, ruleId: string): string => {
    const helpEscapedForHtml = escape(help);
    const ruleIdEscapedForHtml = escape(ruleId);

    return `${helpEscapedForHtml}<br><a href="${helpUrl}">${ruleIdEscapedForHtml}</a>`;
};

const buildApplicationHtml = (pageTitle: string, pageUrl: string): string => {
    const pageTitleEscapedForHtml = escape(pageTitle);
    const pageUrlEscapedForUrl = encodeURI(pageUrl);
    const pageUrlEscapedForHtml = escape(pageUrl);

    return `<a href="${pageUrlEscapedForUrl}">${pageTitleEscapedForHtml}<br>${pageUrlEscapedForHtml}</a>`;
};

const buildSnippetHtml = (snippet: string): string => {
    const maxSnippetLength = 256;
    let constrainedSnippet = snippet;

    if (snippet.length > maxSnippetLength) {
        constrainedSnippet = snippet.substr(0, maxSnippetLength) + '...';
    }

    return escape(constrainedSnippet);
};

const buildHowToFixHtml = (failureSummary: string): string => {
    return escape(failureSummary)
        .replace(/\n  /g, '<br>- ')
        .replace(/\n /g, '<br> ')
        .replace(/\n/g, '<br>');
};

export const getIssueDetailsHtml = (
    stringUtils: IssueUrlCreationUtils,
    environmentInfo: EnvironmentInfo,
    data: CreateIssueDetailsTextData,
): string => {
    const body =
        buildBodySection('Issue Details', buildIssueDetails(data.ruleResult.help, data.ruleResult.helpUrl, data.ruleResult.ruleId)) +
        buildBodySection('Application', buildApplicationHtml(data.pageTitle, data.pageUrl)) +
        buildBodySection('Element Path', escape(data.ruleResult.selector)) +
        buildBodySection('Snippet', buildSnippetHtml(data.ruleResult.html)) +
        buildBodySection('How to fix', buildHowToFixHtml(data.ruleResult.failureSummary)) +
        buildBodySection(
            'To reproduce',
            `Use <a href="http://aka.ms/AccessibilityInsights">${title}</a> to investigate the issue details`,
        ) +
        buildBodySection('Environment', escape(environmentInfo.browserSpec)) +
        stringUtils.getFooter(environmentInfo);

    return body;
};
