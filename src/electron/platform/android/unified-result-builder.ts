// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { generateUID, UUIDGeneratorType } from 'common/uid-generator';
import { ScanResults } from 'electron/platform/android/scan-results';
import {
    convertScanResultsToUnifiedResults,
    ConvertScanResultsToUnifiedResultsDelegate,
} from 'electron/platform/android/scan-results-to-unified-results';
import {
    convertScanResultsToUnifiedRules,
    ConvertScanResultsToUnifiedRulesDelegate,
} from 'electron/platform/android/scan-results-to-unified-rules';

export const createBuilder = (
    getUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
    getUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
    uuidGenerator: UUIDGeneratorType,
) => (scanResults: ScanResults): UnifiedScanCompletedPayload => {
    const payload: UnifiedScanCompletedPayload = {
        scanResult: getUnifiedResults(scanResults, uuidGenerator),
        rules: getUnifiedRules(scanResults, uuidGenerator),
        toolInfo: {
            scanEngineProperties: {
                name: 'axe-android',
                version: scanResults.axeVersion,
            },
            applicationProperties: {
                name: 'AI-Android',
                version: '0.0',
            },
        },
        targetAppInfo: {
            name: scanResults.appIdentifier,
        },
    };
    return payload;
};

export const createDefaultBuilder = () => {
    return createBuilder(convertScanResultsToUnifiedResults, convertScanResultsToUnifiedRules, generateUID);
};
