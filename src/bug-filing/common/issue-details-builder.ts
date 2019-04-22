// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from '../../content/strings/application';

export class IssueDetailsBuilder {
    constructor(private readonly markup: MarkupFactory) {}

    public build = (stringUtils, environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const result = data.ruleResult;
        const markup = this.markup;

        const text = [
            `${markup.bold('Issue')}: ${markup.snippet(result.help)} (${markup.link(result.helpUrl, result.ruleId)})`,
            ``,
            `${markup.bold('Target application')}: [${data.pageTitle}](${data.pageUrl})`,
            ``,
            `${markup.bold('Element path')}: ${data.ruleResult.selector}`,
            ``,
            `${markup.bold('Snippet')}:`,
            `${markup.snippet(result.snippet)}`,
            ``,
            `${markup.bold('How to fix')}:`,
            ``,
            `${this.buildHowToFix(result.failureSummary)}`,
            ``,
            `${markup.bold('Environment')}:`,
            `${environmentInfo.browserSpec}`,
            ``,
            `====`,
            ``,
            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${markup.link('http://aka.ms/AccessibilityInsights')}.`,
        ].join('\n');

        return text;
    };

    private buildHowToFix(failureSummary: string): string {
        return failureSummary
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    }
}
