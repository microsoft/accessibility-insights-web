// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const needsReviewRuleResourcesPath =
    'https://accessibilityinsights.io/info-examples/web/needs-review';

export const isOutcomeNeedsReview = (outcomeType: string): boolean => {
    return outcomeType === 'review';
};

export const getNeedsReviewRuleResourcesUrl = (ruleId: string): string => {
    return `${needsReviewRuleResourcesPath}/${ruleId}`;
};
