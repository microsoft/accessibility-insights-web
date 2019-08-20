// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../common/types/create-issue-details-text-data';
import { IssueUrlCreationUtils } from '../issue-filing/common/issue-filing-url-string-utils';

export class IssueDetailsTextGenerator {
    constructor(
        private extensionVersion: string,
        private browserSpec: string,
        private axeCoreVersion: string,
        private issueFilingUrlStringUtils: IssueUrlCreationUtils,
    ) {}

    public buildText(data: CreateIssueDetailsTextData): string {
        const result = data.ruleResult;
        const standardTags = this.standardizeTags(data);

        const text = [
            `Title: ${this.issueFilingUrlStringUtils.getTitle(data)}`,
            `Tags: ${this.buildTags(data, standardTags)}`,
            ``,
            `Issue: ${result.help} (${result.ruleId}: ${result.helpUrl})`,
            ``,
            `Target application title: ${data.pageTitle}`,
            `Target application url: ${data.pageUrl}`,
            ``,
            `Element path: ${data.ruleResult.selector}`,
            ``,
            `Snippet: ${this.collapseConsecutiveSpaces(result.snippet)}`,
            ``,
            `How to fix:`,
            `${result.failureSummary}`,
            ``,
            `Environment:`,
            `${this.browserSpec}`,
            ``,
            `====`,
            ``,
            this.footer,
        ].join('\n');

        return text;
    }

    private get footer(): string {
        return (
            'This accessibility issue was found using Accessibility Insights for Web ' +
            `${this.extensionVersion} (axe-core ${this.axeCoreVersion}), ` +
            'a tool that helps find and fix accessibility issues. Get more information & download ' +
            'this tool at http://aka.ms/AccessibilityInsights.'
        );
    }

    private collapseConsecutiveSpaces(input: string): string {
        return input.replace(/\s+/g, ' ');
    }

    public buildTags(createIssueData: CreateIssueDetailsTextData, standardTags: string[]): string {
        const tags = ['Accessibility', ...standardTags, createIssueData.ruleResult.ruleId];
        return tags.join(', ');
    }

    private standardizeTags(data: CreateIssueDetailsTextData): string[] {
        return data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());
    }
}
