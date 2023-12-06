// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    getNeedsReviewRuleResourcesUrl,
    isOutcomeNeedsReview,
} from 'common/configs/needs-review-rule-resources';

describe(getNeedsReviewRuleResourcesUrl, () => {
    const ruleId = 'rule-id';

    it('for ruleId passed to get NeedsReviewRuleResourcesUrl', () => {
        const needsReviewRuleResourcesPath =
            'https://accessibilityinsights.io/info-examples/web/needs-review';

        const expectedUrl = `${needsReviewRuleResourcesPath}/${ruleId}`;

        const resourceUrl = getNeedsReviewRuleResourcesUrl(ruleId);

        expect(resourceUrl).toBe(expectedUrl);
    });
});

describe(isOutcomeNeedsReview, () => {
    const ruleId = 'color-contrast';
    const outcomeType = 'review';

    it('for outcome that is review and ruleId is eligble for needsReview', () => {
        const expectedBoolean = true;

        const result = isOutcomeNeedsReview(ruleId, outcomeType);

        expect(result).toBe(expectedBoolean);
    });

    it('for outcome that is not review and ruleId is eligble for needsReview', () => {
        const otherOutcomeType = 'issue';

        const expectedBoolean = false;

        const result = isOutcomeNeedsReview(ruleId, otherOutcomeType);

        expect(result).toBe(expectedBoolean);
    });

    it('for outcome that is review and ruleId is not eligble for needsReview', () => {
        const otherRuleId = 'rule-id';

        const expectedBoolean = false;

        const result = isOutcomeNeedsReview(otherRuleId, outcomeType);

        expect(result).toBe(expectedBoolean);
    });

    it('for outcome that is not review and ruleId is not eligble for needsReview', () => {
        const otherRuleId = 'rule-id';

        const otherOutcomeType = 'issue';

        const expectedBoolean = false;

        const result = isOutcomeNeedsReview(otherRuleId, otherOutcomeType);

        expect(result).toBe(expectedBoolean);
    });
});
