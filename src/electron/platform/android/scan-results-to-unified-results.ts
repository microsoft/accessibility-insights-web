// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { convertAtfaScanResultsToUnifiedResults } from 'electron/platform/android/atfa-scan-results-to-unified-results';
import { convertAxeScanResultsToUnifiedResults } from 'electron/platform/android/axe-scan-results-to-unified-results';
import { AndroidScanResults } from './android-scan-results';
import { RuleInformationProviderType } from './rule-information-provider-type';

export type ConvertScanResultsToUnifiedResultsDelegate = (
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
) => UnifiedResult[];

export function convertScanResultsToUnifiedResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    return convertAxeScanResultsToUnifiedResults(
        scanResults,
        ruleInformationProvider,
        uuidGenerator,
    ).concat(
        convertAtfaScanResultsToUnifiedResults(scanResults, ruleInformationProvider, uuidGenerator),
    );
}
