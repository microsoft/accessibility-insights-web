// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { compact } from 'lodash';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData): string => {
        const { howToFixSection, link, sectionHeader, snippet, sectionHeaderSeparator, footerSeparator, sectionSeparator } = markup;

        const snippetSection = data.snippet
            ? [sectionHeader('Snippet'), sectionHeaderSeparator(), snippet(data.snippet), sectionSeparator()]
            : null;

        const lines = [
            sectionHeader('Issue'),
            sectionHeaderSeparator(),
            `${snippet(data.rule.description)} (${link(data.rule.url, data.rule.id)})`,
            sectionSeparator(),

            sectionHeader('Target application'),
            sectionHeaderSeparator(),
            link(data.targetApp.url, data.targetApp.name),
            sectionSeparator(),

            sectionHeader('Element path'),
            sectionHeaderSeparator(),
            data.element.identifier,
            sectionSeparator(),

            ...snippetSection,

            sectionHeader('How to fix'),
            sectionHeaderSeparator(),
            howToFixSection(data.howToFixSummary),
            sectionSeparator(),

            sectionHeader('Environment'),
            sectionHeaderSeparator(),
            environmentInfo.browserSpec,
            sectionSeparator(),

            footerSeparator(),

            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${link('http://aka.ms/AccessibilityInsights')}.`,
        ];

        return compact(lines).join('');
    };

    return getter;
};
