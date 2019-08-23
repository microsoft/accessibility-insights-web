// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getUnifiedRuleResults,
    UnifiedRuleResult,
    UnifiedRuleResultStatus,
    UnifiedStatusResults,
} from '../../../common/rule-based-view-model-provider';
import { InstanceResultStatus, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';

describe('RuleBasedViewModelProvider', () => {
    test('getUnifiedRuleResults', () => {
        const rules: UnifiedRule[] = [];
        for (let i = 1; i <= 3; i++) {
            rules.push(createUnifiedRuleStub(`rule${i}`));
        }

        const resultStub1: UnifiedResult = createUnifiedResultStub('pass', 'rule1');
        const resultStub2: UnifiedResult = createUnifiedResultStub('fail', 'rule1');
        const resultStub3: UnifiedResult = createUnifiedResultStub('unknown', 'rule2');

        const results: UnifiedResult[] = [resultStub1, resultStub2, resultStub3];

        const expectedResults: UnifiedStatusResults = {
            pass: [
                {
                    id: 'rule1',
                    status: 'pass',
                    nodes: [resultStub1],
                } as UnifiedRuleResult,
            ],
            fail: [
                {
                    id: 'rule1',
                    status: 'fail',
                    nodes: [resultStub2],
                } as UnifiedRuleResult,
            ],
            unknown: [
                {
                    id: 'rule2',
                    status: 'unknown',
                    nodes: [resultStub3],
                } as UnifiedRuleResult,
            ],
            inapplicable: [
                {
                    id: 'rule3',
                    status: 'inapplicable',
                    nodes: [],
                } as UnifiedRuleResult,
            ],
        };

        const actualResults: UnifiedStatusResults = getUnifiedRuleResults(rules, results);

        expect(actualResults).toEqual(expectedResults);
    });

    function createUnifiedRuleStub(id: string): UnifiedRule {
        return {
            id: id,
        } as UnifiedRule;
    }

    function createUnifiedResultStub(status: string, id: string): UnifiedResult {
        return {
            uid: 'stub_uid',
            status: status as InstanceResultStatus,
            ruleId: id,
        } as UnifiedResult;
    }
});
