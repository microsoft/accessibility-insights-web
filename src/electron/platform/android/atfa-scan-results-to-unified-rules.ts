// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { createUnifiedRuleFromRuleResult } from 'electron/platform/android/scan-results-to-unified-rules';
import { AndroidScanResults } from './android-scan-results';
import { RuleInformationProviderType } from './rule-information-provider-type';

export type ConvertScanResultsToUnifiedRulesDelegate = (
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
) => UnifiedRule[];

export function convertAtfaScanResultsToUnifiedRules(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedRule[] {
    if (!scanResults) {
        return [];
    }

    const unifiedRules: UnifiedRule[] = [];
    const ruleIds: Set<string> = new Set();

    for (const atfaResult of scanResults.atfaResults) {
        const ruleId: string = atfaResult['AccessibilityCheckResult.checkClass'];
        if (!ruleIds.has(ruleId)) {
            const ruleInformation = ruleInformationProvider.getRuleInformation(ruleId);

            if (ruleInformation) {
                unifiedRules.push(createUnifiedRuleFromRuleResult(ruleInformation, uuidGenerator));
                ruleIds.add(ruleId);
            }
        }
    }

    return unifiedRules;
}
