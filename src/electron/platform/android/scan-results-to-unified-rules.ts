// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { convertAtfsScanResultsToUnifiedRules } from 'electron/platform/android/atfa-scan-results-to-unified-rules';
import { convertAxeScanResultsToUnifiedRules } from 'electron/platform/android/axe-scan-results-to-unified-rules';
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
        convertAtfsScanResultsToUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator),
    );
}
