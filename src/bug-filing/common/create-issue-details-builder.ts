// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
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

            markup.sectionHeader('How to fix'),
            markup.howToFixSection(result.failureSummary),

            markup.sectionHeader('Environment'),
            environmentInfo.browserSpec,
        ].join('\n');

        return text;
    };

    return getter;
};
