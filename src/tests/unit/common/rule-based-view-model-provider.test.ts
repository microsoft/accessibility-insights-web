// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getUnifiedRuleResults } from '../../../common/rule-based-view-model-provider';
import { InstanceResultStatus, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';
import { UnifiedRuleResult, UnifiedStatusResults } from '../../../DetailsView/components/cards/failed-instances-section-v2';

describe('RuleBasedViewModelProvider', () => {
    test('getUnifiedRuleResults', () => {
        const rules = getSampleRules();

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
                    guidance: [
                        {
                            href: 'stub_guidance_href_rule1',
                            text: 'stub_guidance_text_rule1',
                        },
                    ],
                },
            ],
            fail: [
                {
                    id: 'rule1',
                    status: 'fail',
                    nodes: [resultStub2],
                    description: 'stub_description_rule1',
                    url: 'stub_url_rule1',
                    guidance: [
                        {
                            href: 'stub_guidance_href_rule1',
                            text: 'stub_guidance_text_rule1',
                        },
                    ],
                },
            ],
            unknown: [
                {
                    id: 'rule2',
                    status: 'unknown',
                    nodes: [resultStub3, resultStub4],
                    description: 'stub_description_rule2',
                    url: 'stub_url_rule2',
                    guidance: [
                        {
                            href: 'stub_guidance_href_rule2',
                            text: 'stub_guidance_text_rule2',
                        },
                    ],
                },
            ],
            inapplicable: [
                {
                    id: 'rule3',
                    status: 'inapplicable',
                    nodes: [],
                    description: 'stub_description_rule3',
                    url: 'stub_url_rule3',
                    guidance: [
                        {
                            href: 'stub_guidance_href_rule3',
                            text: 'stub_guidance_text_rule3',
                        },
                    ],
                } as UnifiedRuleResult,
            ],
        };

        const actualResults: UnifiedStatusResults = getUnifiedRuleResults(rules, results);

        expect(actualResults).toEqual(expectedResults);
    });

    function getSampleRules(): UnifiedRule[] {
        const rules: UnifiedRule[] = [];

        for (let i = 1; i <= 3; i++) {
            rules.push(createUnifiedRuleStub(`rule${i}`));
        }

        return rules;
    }

    function createUnifiedRuleStub(id: string): UnifiedRule {
        return {
            id: id,
            description: `stub_description_${id}`,
            url: `stub_url_${id}`,
            guidance: [
                {
                    href: `stub_guidance_href_${id}`,
                    text: `stub_guidance_text_${id}`,
                },
            ],
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
