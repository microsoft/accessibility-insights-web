// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';

export type IssueUrlCreationUtils = {
    getTitle: (result: UnifiedResult, rule: UnifiedRule) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (rule: UnifiedRule) => string[];
};

const getTitle = (result: UnifiedResult, rule: UnifiedRule): string => {
    const standardTags = standardizeTags(rule);
    let prefix = standardTags.join(',');
    if (prefix.length > 0) {
        prefix = prefix + ': ';
    }

    const shortName = result.identifiers.shortName;

    return `${prefix}${rule.description} (${shortName})`;
};

const getSelectorLastPart = (selector: string): string => {
    const splitedSelector = selector.split(';');
    const selectorLastPart = splitedSelector[splitedSelector.length - 1];

    const childCombinator = ' > ';

    if (selectorLastPart.lastIndexOf(childCombinator) > 0) {
        return selectorLastPart.substr(selectorLastPart.lastIndexOf(childCombinator) + childCombinator.length);
    }

    return selectorLastPart;
};

const standardizeTags = (rule: UnifiedRule): string[] => {
    const guidanceLinkTextTags = rule.guidance.map(link => link.text.toUpperCase());
    const tagsFromGuidanceLinkTags = [];
    rule.guidance.map(link => (link.tags ? link.tags.map(tag => tagsFromGuidanceLinkTags.push(tag.displayText)) : []));
    return guidanceLinkTextTags.concat(tagsFromGuidanceLinkTags);
};

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    standardizeTags,
};
