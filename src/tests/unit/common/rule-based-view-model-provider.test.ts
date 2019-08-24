// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getUnifiedRuleResults } from '../../../common/rule-based-view-model-provider';
import { InstanceResultStatus, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';
import { UnifiedRuleResult, UnifiedStatusResults } from '../../../DetailsView/components/cards/failed-instances-section-v2';

describe('RuleBasedViewModelProvider', () => {
    test('getUnifiedRuleResults', () => {
        const rules: UnifiedRule[] = [];
        for (let i = 1; i <= 3; i++) {
            rules.push(createUnifiedRuleStub(`rule${i}`));
        }

        const resultStub1: UnifiedResult = createUnifiedResultStub('pass', 'rule1');
        const resultStub2: UnifiedResult = createUnifiedResultStub('fail', 'rule1');
        const resultStub3: UnifiedResult = createUnifiedResultStub('unknown', 'rule2');
        const resultStub4: UnifiedResult = createUnifiedResultStub('unknown', 'rule2');

        const results: UnifiedResult[] = [resultStub1, resultStub2, resultStub3, resultStub4];

        const expectedResults: UnifiedStatusResults = {
            pass: [
                {
                    id: 'rule1',
                    status: 'pass',
                    nodes: [resultStub1],
                    description: 'stub_description_rule1',
                    url: 'stub_url_rule1',
                    guidance: [],
                },
            ],
            fail: [
                {
                    id: 'rule1',
                    status: 'fail',
                    nodes: [resultStub2],
                    description: 'stub_description_rule1',
                    url: 'stub_url_rule1',
                    guidance: [],
                },
            ],
            unknown: [
                {
                    id: 'rule2',
                    status: 'unknown',
                    nodes: [resultStub3, resultStub4],
                    description: 'stub_description_rule2',
                    url: 'stub_url_rule2',
                    guidance: [],
                },
            ],
            inapplicable: [
                {
                    id: 'rule3',
                    status: 'inapplicable',
                    nodes: [],
                    description: 'stub_description_rule3',
                    url: 'stub_url_rule3',
                    guidance: [],
                } as UnifiedRuleResult,
            ],
        };

        const actualResults: UnifiedStatusResults = getUnifiedRuleResults(rules, results);

        expect(actualResults).toEqual(expectedResults);
    });

    function createUnifiedRuleStub(id: string): UnifiedRule {
        return {
            id: id,
            description: `stub_description_${id}`,
            url: `stub_url_${id}`,
            guidance: [],
        };
    }

    function createUnifiedResultStub(status: InstanceResultStatus, id: string): UnifiedResult {
        return {
            uid: 'stub_uid',
            status: status,
            ruleId: id,
        } as UnifiedResult;
    }
});
