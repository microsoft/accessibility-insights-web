// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from '../../common/types/store-data/unified-data-interface';
import { RuleResult, ScanResults } from '../../scanner/iruleresults';

export function convertScanResultsToUnifiedRules(scanResults: ScanResults): UnifiedRule[] {
    if (!scanResults) {
        return [] as UnifiedRule[];
    }
    return createUnifiedRulesFromScanResults(scanResults);
}

function createUnifiedRulesFromScanResults(scanResults: ScanResults): UnifiedRule[] {
    const unifiedRules: UnifiedRule[] = [];
    const ruleIds: Set<string> = new Set();
    const allRuleResults = [...scanResults.passes, ...scanResults.violations, ...scanResults.incomplete, ...scanResults.inapplicable];

    for (const ruleResult of allRuleResults) {
        if (!ruleIds.has(ruleResult.id)) {
            unifiedRules.push(createUnifiedRuleFromRuleResult(ruleResult));
            ruleIds.add(ruleResult.id);
        }
    }

    return unifiedRules;
}

function createUnifiedRuleFromRuleResult(ruleResult: RuleResult): UnifiedRule {
    return {
        id: ruleResult.id,
        description: ruleResult.description,
        url: ruleResult.helpUrl,
        guidance: ruleResult.guidanceLinks,
    };
}
