// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { filterResultsByRules } from '../../../../../injected/analyzers/filter-results-by-rules';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';

describe('filterResultsByRules', () => {
    it('should return only filtered results', () => {
        const ruleToKeep = 'rule to keep';
        const ruleToThrowAway = 'rule to throw away';
        const given: ScanResults = {
            passes: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToThrowAway),
            ],
            inapplicable: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToThrowAway),
            ],
            incomplete: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToThrowAway),
            ],
            violations: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToThrowAway),
            ],
            timestamp: '100',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const expected: ScanResults = {
            ...given,
            passes: [getRuleResultStub(ruleToKeep)],
            inapplicable: [getRuleResultStub(ruleToKeep)],
            incomplete: [getRuleResultStub(ruleToKeep)],
            violations: [getRuleResultStub(ruleToKeep)],
        };

        const actual = filterResultsByRules(given, [ruleToKeep]);
        expect(actual).toEqual(expected);
    });

    it('should return same as given since no rules were filtered', () => {
        const ruleToKeep = 'rule to keep';
        const ruleToKeepTwo = 'rule to keep two';
        const given: ScanResults = {
            passes: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToKeepTwo),
            ],
            inapplicable: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToKeepTwo),
            ],
            incomplete: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToKeepTwo),
            ],
            violations: [
                getRuleResultStub(ruleToKeep),
                getRuleResultStub(ruleToKeepTwo),
            ],
            timestamp: '100',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const expected: ScanResults = {
            ...given,
        };

        const actual = filterResultsByRules(given, null);
        expect(actual).toEqual(expected);
    });

    function getRuleResultStub(ruleId): RuleResult {
        return {
            id: ruleId,
        } as RuleResult;
    }
});
