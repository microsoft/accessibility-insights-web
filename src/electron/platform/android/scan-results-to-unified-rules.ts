// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { AndroidScanResults } from './android-scan-results';
import { RuleInformationProviderType } from './rule-information-provider-type';

export type ConvertScanResultsToUnifiedRulesDelegate = (
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
) => UnifiedRule[];

export function convertScanResultsToUnifiedRules(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
    converters: ConvertScanResultsToUnifiedRulesDelegate[],
): UnifiedRule[] {
    const unifiedRules: UnifiedRule[] = [];

    converters?.forEach(converter => {
        unifiedRules.push(...converter(scanResults, ruleInformationProvider, uuidGenerator));
    });

    return unifiedRules;
}

export function createUnifiedRuleFromRuleResult(
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
