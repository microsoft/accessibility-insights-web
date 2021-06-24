// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
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
    converters: ConvertScanResultsToUnifiedResultsDelegate[],
): UnifiedResult[] {
    const unifiedResults: UnifiedResult[] = [];

    converters?.forEach(converter => {
        unifiedResults.push(...converter(scanResults, ruleInformationProvider, uuidGenerator));
    });

    return unifiedResults;
}
