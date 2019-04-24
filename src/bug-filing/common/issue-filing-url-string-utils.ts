// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { endsWith } from 'lodash';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getTitle: (data: CreateIssueDetailsTextData) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: CreateIssueDetailsTextData) => string[];
    appendSuffixToUrl: (url: string, suffix: string) => string;
    appendIssuesSuffixToGitHubUrl: (url: string) => string;
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
    let selectorLastPart = selector;
    if (selector.lastIndexOf(' > ') > 0) {
        selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
    }
    return selectorLastPart;
};

const appendSuffixToUrl = (url: string, suffix: string): string => {
    if (endsWith(url, suffix)) {
        return url;
    }
    if (endsWith(url, `${suffix}/`)) {
        return url.substr(0, url.length - 1);
    }

    return `${url}/${suffix}`;
};

const appendIssuesSuffixToGitHubUrl = (url: string): string => {
    const ownerAndRepo = new RegExp('^https?://github.com/[^/]+/[^/]+$');
    const ownerAndRepoAndSlash = new RegExp('^https?://github.com/[^/]+/[^/]+/?$');

    if (ownerAndRepo.test(url)) {
        return `${url}/issues`;
    }

    if (ownerAndRepoAndSlash.test(url)) {
        return `${url}issues`;
    }

    return url;
};

const standardizeTags = (data: CreateIssueDetailsTextData): string[] => data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    appendSuffixToUrl,
    standardizeTags,
    appendIssuesSuffixToGitHubUrl,
};
