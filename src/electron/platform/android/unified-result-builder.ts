// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { generateUID, UUIDGeneratorType } from 'common/uid-generator';
import { ApplicationPropertiesDelegate } from 'electron/common/application-properties-provider';
import { ScanResults } from 'electron/platform/android/scan-results';
import {
    convertScanResultsToUnifiedResults,
    ConvertScanResultsToUnifiedResultsDelegate,
} from 'electron/platform/android/scan-results-to-unified-results';
import {
    convertScanResultsToUnifiedRules,
    ConvertScanResultsToUnifiedRulesDelegate,
} from 'electron/platform/android/scan-results-to-unified-rules';

export type UnifiedScanCompletedPayloadBuilder = (scanResults: ScanResults) => UnifiedScanCompletedPayload;

export const createBuilder = (
    getUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
    getUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
    uuidGenerator: UUIDGeneratorType,
    applicationPropertiesDelegate: ApplicationPropertiesDelegate,
) => (scanResults: ScanResults): UnifiedScanCompletedPayload => {
    const payload: UnifiedScanCompletedPayload = {
        scanResult: getUnifiedResults(scanResults, uuidGenerator),
        rules: getUnifiedRules(scanResults, uuidGenerator),
        toolInfo: {
            scanEngineProperties: {
                name: 'axe-android',
                version: scanResults.axeVersion,
            },
            applicationProperties: applicationPropertiesDelegate(),
        },
        targetAppInfo: {
            name: scanResults.appIdentifier,
        },
    };
    return payload;
};

export const createDefaultBuilder = (applicationPropertiesDelegate: ApplicationPropertiesDelegate) => {
    return createBuilder(convertScanResultsToUnifiedResults, convertScanResultsToUnifiedRules, generateUID, applicationPropertiesDelegate);
};
