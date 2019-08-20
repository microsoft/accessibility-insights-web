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
            `Title: ${this.buildTitle(data, standardTags)}`,
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

    public buildTitle(data: CreateIssueDetailsTextData, standardTags?: string[]): string {
        if (!standardTags) {
            standardTags = this.standardizeTags(data);
        }

        let prefix = standardTags.join(',');
        if (prefix.length > 0) {
            prefix = prefix + ': ';
        }

        const selectorLastPart = this.issueFilingUrlStringUtils.getSelectorLastPart(data.ruleResult.selector);

        return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
    }

    public buildTags(createIssueData: CreateIssueDetailsTextData, standardTags: string[]): string {
        const tags = ['Accessibility', ...standardTags, createIssueData.ruleResult.ruleId];
        return tags.join(', ');
    }

    public getSelectorLastPart(selector: string): string {
        let selectorLastPart = selector;
        if (selector.lastIndexOf(' > ') > 0) {
            selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
        }
        return selectorLastPart;
    }

    private standardizeTags(data: CreateIssueDetailsTextData): string[] {
        return data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());
    }
}
