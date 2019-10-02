// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { compact, forOwn } from 'lodash';

import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { StoredInstancePropertyBag, UnifiedResult } from '../../common/types/store-data/unified-data-interface';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (environmentInfo: EnvironmentInfo, data: CreateIssueDetailsTextData, unifiedResult?: UnifiedResult): string => {
        const result = data.ruleResult;

        const { howToFixSection, link, sectionHeader, snippet, sectionHeaderSeparator, footerSeparator, sectionSeparator } = markup;

        const getSection = (propertyBag: StoredInstancePropertyBag, formatter: (content: string) => string) => {
            const section: string[] = [];
            forOwn(propertyBag, (value, key) => {
                const displayName = getPropertyConfiguration(key).displayName;
                section.concat([sectionHeader(displayName), sectionHeaderSeparator(), formatter(value), sectionSeparator()]);
            });
            return section;
        };

        const lines = [
            sectionHeader('Issue'),
            sectionHeaderSeparator(),
            `${snippet(result.help)} (${link(result.helpUrl, result.ruleId)})`,
            sectionSeparator(),

            sectionHeader('Target application'),
            sectionHeaderSeparator(),
            // do conditional render based on whether pageUrl is available
            link(data.pageUrl, data.pageTitle),
            sectionSeparator(),

            getSection(unifiedResult.identifiers, text => text),

            getSection(unifiedResult.descriptors, snippet),

            getSection(unifiedResult.resolution, howToFixSection),

            sectionHeader('How to fix'),
            sectionHeaderSeparator(),
            howToFixSection(result.failureSummary),
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
