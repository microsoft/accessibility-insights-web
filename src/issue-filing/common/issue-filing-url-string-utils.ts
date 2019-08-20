// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getTitle: (data: CreateIssueDetailsTextData) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: CreateIssueDetailsTextData) => string[];
};

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
    const splitedSelector = selector.split(';');
    let selectorLastPart = splitedSelector[splitedSelector.length - 1];

    const childCombinator = ' > ';

    if (selector.lastIndexOf(childCombinator) > 0) {
        selectorLastPart = selector.substr(selector.lastIndexOf(childCombinator) + childCombinator.length);
    }

    return selectorLastPart;
};

const standardizeTags = (data: CreateIssueDetailsTextData): string[] => {
    const guidanceLinkTextTags = data.ruleResult.guidanceLinks.map(link => link.text.toUpperCase());
    const tagsFromGuidanceLinkTags = [];
    data.ruleResult.guidanceLinks.map(link => (link.tags ? link.tags.map(tag => tagsFromGuidanceLinkTags.push(tag.displayText)) : []));
    return guidanceLinkTextTags.concat(tagsFromGuidanceLinkTags);
};

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    standardizeTags,
};
