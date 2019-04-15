// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { endsWith } from 'lodash';

import { EnvironmentInfo } from '../../common/environment-info-provider';
import { title } from '../../content/strings/application';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getFooterContent: (info: EnvironmentInfo) => string;
    collapseConsecutiveSpaces: (input: string) => string;
    formatAsMarkdownCodeBlock: (input: string) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: CreateIssueDetailsTextData) => string[];
    appendSuffixToUrl: (url: string, suffix: string) => string;
};

export const IssueFilingUrlStringUtils: IssueUrlCreationUtils = {
    getFooterContent: (environmentInfo: EnvironmentInfo): string => {
        return (
            `This accessibility issue was found using ${title} ` +
            `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
            'a tool that helps find and fix accessibility issues. Get more information & download ' +
            'this tool at http://aka.ms/AccessibilityInsights.'
        );
    },
    collapseConsecutiveSpaces: (input: string): string => input.replace(/\s+/g, ' '),
    formatAsMarkdownCodeBlock: (input: string): string =>
        input
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n'),
    getSelectorLastPart: (selector: string): string => {
        let selectorLastPart = selector;
        if (selector.lastIndexOf(' > ') > 0) {
            selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
        }
        return selectorLastPart;
    },
    appendSuffixToUrl: (url: string, suffix: string): string => {
        if (endsWith(url, suffix) || endsWith(url, `${suffix}/`)) {
            return url;
        }

        return `${url}/${suffix}/`;
    },
    standardizeTags: (data: CreateIssueDetailsTextData): string[] => data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase()),
};
