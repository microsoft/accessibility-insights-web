// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from '../../../../../common/types/store-data/unified-data-interface';
import { convertScanResultsToUnifiedRules } from '../../../../../injected/adapters/scan-results-to-unified-rules';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';

describe('ScanResults to UnifiedRule[] test', () => {
    test('convertScanResultsToUnifiedRules', () => {
        const scanResultsStub = {
            passes: [createRuleResultStub('rule1')],
            violations: [createRuleResultStub('rule1')],
            inapplicable: [createRuleResultStub('rule2'), createRuleResultStub('rule3')],
            incomplete: [],
        } as ScanResults;

        const expectedResults: UnifiedRule[] = getSampleUnifiedRuleStubs(3);

        const actualResults: UnifiedRule[] = convertScanResultsToUnifiedRules(scanResultsStub);

        expect(actualResults).toEqual(expectedResults);
    });

    function createRuleResultStub(id: string): RuleResult {
        return {
            id: `stub_${id}`,
            nodes: [],
            description: `stub_description_${id}`,
            helpUrl: `stub_url_${id}`,
            guidanceLinks: [
                {
                    href: `stub_guidance_href_${id}`,
                    text: `stub_guidance_text_${id}`,
                },
            ],
        };
    }

    function createUnifiedRuleStub(id: string): UnifiedRule {
        return {
            id: `stub_${id}`,
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

    function getSampleUnifiedRuleStubs(numRules: number): UnifiedRule[] {
        const unifiedRules = [] as UnifiedRule[];

        for (let i = 1; i <= numRules; i++) {
            unifiedRules.push(createUnifiedRuleStub(`rule${i}`));
        }

        return unifiedRules;
    }
});
