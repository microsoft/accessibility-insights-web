// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const result = data.ruleResult;

        const { howToFixSection, link, sectionHeader, snippet } = markup;

        const text = [
            sectionHeader('Issue'),
            `${snippet(result.help)} (${link(result.helpUrl, result.ruleId)})`,

            sectionHeader('Target application'),
            link(data.pageUrl, data.pageTitle),

            sectionHeader('Element path'),
            data.ruleResult.selector,

            sectionHeader('Snippet'),
            snippet(result.snippet),

            sectionHeader('How to fix'),
            howToFixSection(result.failureSummary),

            sectionHeader('Environment'),
            environmentInfo.browserSpec,

            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${link('http://aka.ms/AccessibilityInsights')}.`,
        ].join('\n');

        return text;
    };

    return getter;
};
