// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InstanceResultStatus, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGeneratorType } from 'common/uid-generator';
import { RuleInformation } from './rule-information';
import { RuleInformationProvider } from './rule-information-provider';
import { RuleResultsData, ScanResults } from './scan-results';

export type ConvertScanResultsToUnifiedResultsDelegate = (scanResults: ScanResults, uuidGenerator: UUIDGeneratorType) => UnifiedResult[];

export function convertScanResultsToUnifiedResults(scanResults: ScanResults, uuidGenerator: UUIDGeneratorType): UnifiedResult[] {
    if (!scanResults || !scanResults.ruleResults) {
        return [];
    }

    return createUnifiedResultsFromScanResults(scanResults.ruleResults, uuidGenerator);
}

function createUnifiedResultsFromScanResults(ruleResults: RuleResultsData[], uuidGenerator: UUIDGeneratorType): UnifiedResult[] {
    const ruleInformationProvider: RuleInformationProvider = new RuleInformationProvider();

    const unifiedResults: UnifiedResult[] = [];

    for (const ruleResult of ruleResults) {
        const ruleInformation: RuleInformation = ruleInformationProvider.getRuleInformation(ruleResult.ruleId);

        if (ruleInformation) {
            unifiedResults.push(createUnifiedResult(ruleInformation, ruleResult, uuidGenerator));
        }
    }

    return unifiedResults;
}

function createUnifiedResult(
    ruleInformation: RuleInformation,
    ruleResult: RuleResultsData,
    uuidGenerator: UUIDGeneratorType,
): UnifiedResult {
    return {
        uid: uuidGenerator(),
        ruleId: ruleInformation.ruleId,
        status: getStatus(ruleResult.status),
        identifiers: null,
        descriptors: null,
        resolution: {
            'how-to-fix': ruleInformation.howToFix(ruleResult),
        },
    };
}

function getStatus(status: string): InstanceResultStatus {
    switch (status) {
        case 'PASS':
            return 'pass';
        case 'FAIL':
            return 'fail';
        default:
            return 'unknown';
    }
}
