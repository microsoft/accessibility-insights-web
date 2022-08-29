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

    return `${prefix}${data.rule.description} (${data.element.conciseName})`;
};

const getSelectorLastPart = (selector: string): string => {
    const splitedSelector = selector.split(';');
    const selectorLastPart = splitedSelector[splitedSelector.length - 1];

    const childCombinator = ' > ';

    if (selectorLastPart.lastIndexOf(childCombinator) > 0) {
        return selectorLastPart.substr(
            selectorLastPart.lastIndexOf(childCombinator) + childCombinator.length,
        );
    }

    return selectorLastPart;
};

const standardizeTags = (data: CreateIssueDetailsTextData): string[] => {
    const guidanceLinkTextTags = data.rule.guidance ? data.rule.guidance.map(link => link.text.toUpperCase()) : [];
    const tagsFromGuidanceLinkTags: string[] = [];
    data.rule.guidance?.map(link =>
        link.tags ? link.tags.map(tag => tagsFromGuidanceLinkTags.push(tag.displayText)) : [],
    );
    return guidanceLinkTextTags.concat(tagsFromGuidanceLinkTags);
};

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    standardizeTags,
};
