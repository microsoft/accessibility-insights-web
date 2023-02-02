// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { compact } from 'lodash';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueDetailsBuilder, IssueDetailsBuilderOptions } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (
        toolData: ToolData,
        data: CreateIssueDetailsTextData,
        options?: IssueDetailsBuilderOptions,
    ): string => {
        const isLengthConstrained = options?.isLengthConstrained ?? false;

        const {
            howToFixSection: howToFixSummary,
            link,
            sectionHeader,
            snippet,
            relatedPaths,
            sectionHeaderSeparator,
            footerSeparator,
            sectionSeparator,
        } = markup;

        const targetAppText = data.targetApp.url
            ? link(data.targetApp.url, data.targetApp.name)
            : data.targetApp.name;

        const snippetSection = data.snippet
            ? [
                  sectionHeader('Snippet'),
                  sectionHeaderSeparator(),
                  snippet(data.snippet),
                  sectionSeparator(),
              ]
            : [];

        const relatedPathsSection =
            !isLengthConstrained && data.relatedPaths
                ? [
                      sectionHeader('Related paths'),
                      sectionHeaderSeparator(),
                      relatedPaths(data.relatedPaths),
                      sectionSeparator(),
                  ]
                : [];

        const howToFixSection = data.howToFixSummary
            ? [
                  sectionHeader('How to fix'),
                  sectionHeaderSeparator(),
                  howToFixSummary(data.howToFixSummary),
                  sectionSeparator(),
              ]
            : [];

        const ruleDetailsSection = () => {
            const { description, url, id } = data.rule;
            if (description && url && id) {
                return `${snippet(description)} (${link(url, id)})`;
            }
            return '';
        };

        const lines = [
            sectionHeader('Issue'),
            sectionHeaderSeparator(),
            ruleDetailsSection(),
            sectionSeparator(),

            sectionHeader('Target application'),
            sectionHeaderSeparator(),
            targetAppText,
            sectionSeparator(),

            sectionHeader('Element path'),
            sectionHeaderSeparator(),
            data.element.identifier,
            sectionSeparator(),

            ...snippetSection,

            ...relatedPathsSection,

            ...howToFixSection,

            sectionHeader('Environment'),
            sectionHeaderSeparator(),
            toolData.applicationProperties.environmentName,
            sectionSeparator(),

            footerSeparator(),

            `This accessibility issue was found using ${toolData.applicationProperties.name} ` +
                `${toolData.applicationProperties.version} (${toolData.scanEngineProperties.name} ${toolData.scanEngineProperties.version}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${link('http://aka.ms/AccessibilityInsights')}.`,
        ];

        return compact(lines).join('');
    };

    return getter;
};
