// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { endsWith } from 'lodash';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getTitle: (data: CreateIssueDetailsTextData) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: CreateIssueDetailsTextData) => string[];
    appendSuffixToUrl: (url: string, suffix: string) => string;
};

export const createUtils = (): IssueUrlCreationUtils => {
    const getTitle = (data: CreateIssueDetailsTextData): string => {
        const standardTags = standardizeTags(data);
        let prefix = standardTags.join(',');
        if (prefix.length > 0) {
            prefix = prefix + ': ';
        }

        const selectorLastPart = getSelectorLastPart(data.ruleResult.selector);

        return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
    };
    const getSelectorLastPart = (selector: string): string => {
        let selectorLastPart = selector;
        if (selector.lastIndexOf(' > ') > 0) {
            selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
        }
        return selectorLastPart;
    };
    const appendSuffixToUrl = (url: string, suffix: string): string => {
        if (endsWith(url, suffix) || endsWith(url, `${suffix}/`)) {
            return url;
        }

        return `${url}/${suffix}/`;
    };
    const standardizeTags = (data: CreateIssueDetailsTextData): string[] =>
        data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());

    return {
        getTitle,
        getSelectorLastPart,
        appendSuffixToUrl,
        standardizeTags,
    };
};

export const IssueFilingUrlStringUtils = createUtils();
