// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGeneratorType } from 'common/uid-generator';
import { RuleInformation } from './rule-information';
import { RuleInformationProviderType } from './rule-information-provider-type';
import { ScanResults } from './scan-results';

export type ConvertScanResultsToUnifiedRulesDelegate = (
    scanResults: ScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGeneratorType,
) => UnifiedRule[];

export function convertScanResultsToUnifiedRules(
    scanResults: ScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGeneratorType,
): UnifiedRule[] {
    if (!scanResults) {
        return [];
    }

    const unifiedRules: UnifiedRule[] = [];
    const ruleIds: Set<string> = new Set();

    for (const result of scanResults.ruleResults) {
        const ruleId = result.ruleId;
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

function createUnifiedRuleFromRuleResult(ruleInformation: RuleInformation, uuidGenerator: UUIDGeneratorType): UnifiedRule {
    return {
        uid: uuidGenerator(),
        id: ruleInformation.ruleId,
        description: ruleInformation.ruleDescription,
        url: null,
        guidance: [],
    };
}
