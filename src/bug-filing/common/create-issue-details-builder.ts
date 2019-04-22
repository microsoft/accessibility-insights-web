// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from '../../content/strings/application';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFactory } from './markup-factory';

export const createIssueDetailsBuilder = (markup: MarkupFactory): IssueDetailsBuilder => {
    const getter = (environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const result = data.ruleResult;

        const text = [
            `${markup.bold('Issue')}: ${markup.snippet(result.help)} (${markup.link(result.helpUrl, result.ruleId)})`,
            markup.sectionSeparator(),
            `${markup.bold('Target application')}: ${markup.link(data.pageUrl, data.pageTitle)}`,
            markup.sectionSeparator(),
            `${markup.bold('Element path')}: ${data.ruleResult.selector}`,
            markup.sectionSeparator(),
            `${markup.bold('Snippet')}:`,
            markup.snippet(result.snippet),
            markup.sectionSeparator(),
            `${markup.bold('How to fix')}:`,
            markup.newLine(),
            markup.howToFixSection(result.failureSummary),
            markup.sectionSeparator(),
            `${markup.bold('Environment')}:`,
            environmentInfo.browserSpec,
            markup.sectionSeparator(),
            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${markup.link('http://aka.ms/AccessibilityInsights')}.`,
        ].join('\n');

        return text;
    };

    return getter;
};
