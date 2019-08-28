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
    const allRuleResults = getAllRuleResults(scanResults);

    for (const ruleResult of allRuleResults) {
        if (!unifiedRules.find(rule => rule.id === ruleResult.id)) {
            unifiedRules.push(createUnifiedRuleFromRuleResult(ruleResult));
        }
    }

    return unifiedRules;
}

function getAllRuleResults(scanResults: ScanResults): RuleResult[] {
    return [...scanResults.passes, ...scanResults.violations, ...scanResults.incomplete, ...scanResults.inapplicable];
}

function createUnifiedRuleFromRuleResult(ruleResult: RuleResult): UnifiedRule {
    return {
        id: ruleResult.id,
        description: ruleResult.description,
        url: ruleResult.helpUrl,
        guidance: ruleResult.guidanceLinks,
    };
}
