// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from 'content/strings/application';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const result = data.ruleResult;

        const text = [
            markup.sectionHeader('Issue'),
            `${markup.snippet(result.help)} (${markup.link(result.helpUrl, result.ruleId)})`,

            markup.sectionHeader('Target application'),
            markup.link(data.pageUrl, data.pageTitle),

            markup.sectionHeader('Element path'),
            data.ruleResult.selector,

            markup.sectionHeader('Snippet'),
            markup.snippet(result.snippet),

            markup.sectionHeader('How to fix'),
            markup.howToFixSection(result.failureSummary),

            markup.sectionHeader('Environment'),
            environmentInfo.browserSpec,

            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${markup.link('http://aka.ms/AccessibilityInsights')}.`,
        ].join('\n');

        return text;
    };

    return getter;
};
