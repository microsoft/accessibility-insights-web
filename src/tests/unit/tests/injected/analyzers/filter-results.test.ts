// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { filterNeedsReviewResults } from 'injected/analyzers/filter-results';
import { RuleResult, ScanResults } from 'scanner/iruleresults';

describe('filterNeedsReviewResults', () => {
    it('should return only filtered results', () => {
        const failOnlyRule0 = 'label-content-name-mismatch';
        const inapplicableOnlyRule0 = 'color-contrast';
        const inapplicableOnlyRule1 = 'aria-input-field-name';
        const inapplicableOnlyRule2 = 'th-has-data-cells';
        const testRule = 'test rule';
        const given: ScanResults = {
            violations: [
                getRuleResultStub(testRule),
                getRuleResultStub(failOnlyRule0),
                getRuleResultStub(inapplicableOnlyRule0),
                getRuleResultStub(inapplicableOnlyRule1),
                getRuleResultStub(inapplicableOnlyRule2),
            ],
            incomplete: [
                getRuleResultStub(testRule),
                getRuleResultStub(failOnlyRule0),
                getRuleResultStub(inapplicableOnlyRule0),
                getRuleResultStub(inapplicableOnlyRule1),
                getRuleResultStub(inapplicableOnlyRule2),
            ],
            passes: [getRuleResultStub(testRule)],
            inapplicable: [getRuleResultStub(testRule)],
            timestamp: '100',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const expected: ScanResults = {
            ...given,
            violations: [getRuleResultStub(testRule), getRuleResultStub(failOnlyRule0)],
            incomplete: [
                getRuleResultStub(testRule),
                getRuleResultStub(inapplicableOnlyRule0),
                getRuleResultStub(inapplicableOnlyRule1),
                getRuleResultStub(inapplicableOnlyRule2),
            ],
        };

        const actual = filterNeedsReviewResults(given);
        expect(actual).toEqual(expected);
    });

    it('should return same as given when no rules are filtered', () => {
        const testRule0 = 'test rule';
        const testRule1 = 'extra test rule';
        const given: ScanResults = {
            passes: [getRuleResultStub(testRule0), getRuleResultStub(testRule1)],
            inapplicable: [getRuleResultStub(testRule0), getRuleResultStub(testRule1)],
            incomplete: [getRuleResultStub(testRule0), getRuleResultStub(testRule1)],
            violations: [getRuleResultStub(testRule0), getRuleResultStub(testRule1)],
            timestamp: '100',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const expected: ScanResults = {
            ...given,
        };

        const actual = filterNeedsReviewResults(given);
        expect(actual).toEqual(expected);
    });

    function getRuleResultStub(ruleId): RuleResult {
        return {
            id: ruleId,
        } as RuleResult;
    }
});
