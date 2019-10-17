// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';

import { getUnifiedRuleResults } from '../../../common/rule-based-view-model-provider';
import { CardResult, CardRuleResultsByStatus } from '../../../common/types/store-data/card-view-model';
import { InstanceResultStatus, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';

describe('RuleBasedViewModelProvider', () => {
    const emptyCardSelectionViewData = {} as CardSelectionViewData;

    test('getUnifiedRuleResults with null rules and results', () => {
        const actualResults: CardRuleResultsByStatus = getUnifiedRuleResults(null, null, null);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null rules', () => {
        const actualResults: CardRuleResultsByStatus = getUnifiedRuleResults(null, [], emptyCardSelectionViewData);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null results', () => {
        const actualResults: CardRuleResultsByStatus = getUnifiedRuleResults([], null, emptyCardSelectionViewData);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null card selection view data', () => {
        const actualResults: CardRuleResultsByStatus = getUnifiedRuleResults([], [], null);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults', () => {
        const rules = getSampleRules();

        const resultStub1 = createUnifiedResultStub('pass', 'rule1');
        const resultStub2 = createUnifiedResultStub('fail', 'rule1', true);
        const resultStub3 = createUnifiedResultStub('unknown', 'rule2');
        const resultStub4 = createUnifiedResultStub('unknown', 'rule2');

        const results: UnifiedResult[] = [resultStub1, resultStub2, resultStub3, resultStub4];

        const cardSelectionViewData: CardSelectionViewData = {
            expandedRuleIds: ['rule1'],
            highlightedResultUids: ['stub_uid'],
            selectedResultUids: ['stub_uid'],
        };

        const actualResults: CardRuleResultsByStatus = getUnifiedRuleResults(rules, results, cardSelectionViewData);

        expect(actualResults).toMatchSnapshot();
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

    function createUnifiedResultStub(status: InstanceResultStatus, id: string, isSelected: boolean = false): CardResult {
        return {
            uid: 'stub_uid',
            status: status,
            ruleId: id,
            isSelected,
        } as CardResult;
    }
});
