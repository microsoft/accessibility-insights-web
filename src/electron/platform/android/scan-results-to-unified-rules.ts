// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { convertAtfaScanResultsToUnifiedRules } from 'electron/platform/android/atfa-scan-results-to-unified-rules';
import { convertAxeScanResultsToUnifiedRules } from 'electron/platform/android/axe-scan-results-to-unified-rules';
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
): UnifiedRule[] {
    return convertAxeScanResultsToUnifiedRules(
        scanResults,
        ruleInformationProvider,
        uuidGenerator,
    ).concat(
        convertAtfaScanResultsToUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator),
    );
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
