// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFactory } from './markup-factory';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from '../../content/strings/application';
import { IssueDetailsGetter } from './issue-details-getter';

export const createIssueDetailsBuilder = (markup: MarkupFactory): IssueDetailsGetter => {
    const buildHowToFix = (failureSummary: string): string => {
        return failureSummary
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    };

    const getter = (stringUtils, environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const result = data.ruleResult;

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
            `${buildHowToFix(result.failureSummary)}`,
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

    return getter;
};
