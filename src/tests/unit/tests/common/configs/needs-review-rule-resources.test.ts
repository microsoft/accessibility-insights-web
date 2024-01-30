// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    getNeedsReviewRuleResourcesUrl,
    isOutcomeNeedsReview,
} from 'common/configs/needs-review-rule-resources';

describe(getNeedsReviewRuleResourcesUrl, () => {
    const ruleId = 'rule-id';
    const needsReviewRuleResourcesPath =
        'https://accessibilityinsights.io/info-examples/web/needs-review';

    it('for ruleId passed to get NeedsReviewRuleResourcesUrl', () => {
        const expectedUrl = `${needsReviewRuleResourcesPath}/${ruleId}`;
        expect(getNeedsReviewRuleResourcesUrl(ruleId)).toBe(expectedUrl);
    });
});

describe(isOutcomeNeedsReview, () => {
    it('for outcome that is review', () => {
        expect(isOutcomeNeedsReview('review')).toBe(true);
    });

    it('for outcome that is not review', () => {
        expect(isOutcomeNeedsReview('issue')).toBe(false);
    });
});
