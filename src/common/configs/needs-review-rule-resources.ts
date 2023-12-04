// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const needsReviewRuleResourcesPath = 'https://accessibilityinsights.io/info-examples/web/needs-review';

export const isOutcomeNeedsReview = (ruleId: string, outcomeType: string) => {
    return (needsReviewRules.includes(ruleId) && outcomeType === "review") ? true : false;
};

export const getNeedsReviewRuleResourcesUrl = (ruleId: string) => {
    return `${needsReviewRuleResourcesPath}/${ruleId}`
};

const needsReviewRules = [
    'aria-input-field-name',
    'color-contrast',
    'th-has-data-cells',
    'link-in-text-block',
    'p-as-heading',
];