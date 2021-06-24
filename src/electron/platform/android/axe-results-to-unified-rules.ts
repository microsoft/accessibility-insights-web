// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';

export function convertAxeScanResultsToUnifiedRules(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
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

function createUnifiedRuleFromRuleResult(
    ruleInformation: RuleInformation,
    uuidGenerator: UUIDGenerator,
): UnifiedRule {
    return {
        uid: uuidGenerator(),
        id: ruleInformation.ruleId,
        description: ruleInformation.ruleDescription,
        url: ruleInformation.ruleLink,
        guidance: ruleInformation.guidance,
    };
}
