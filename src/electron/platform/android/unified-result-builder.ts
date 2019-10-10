// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { generateUID, UUIDGeneratorType } from 'common/uid-generator';
import { ToolDataDelegate } from 'electron/common/application-properties-provider';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
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
    getToolData: ToolDataDelegate,
) => (scanResults: ScanResults): UnifiedScanCompletedPayload => {
    const ruleInformationProvider: RuleInformationProviderType = new RuleInformationProvider();
    const payload: UnifiedScanCompletedPayload = {
        scanResult: getUnifiedResults(scanResults, ruleInformationProvider, uuidGenerator),
        rules: getUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator),
        toolInfo: getToolData(scanResults),
        targetAppInfo: {
            name: scanResults.appIdentifier,
        },
    };
    return payload;
};

export const createDefaultBuilder = (getToolData: ToolDataDelegate) => {
    return createBuilder(convertScanResultsToUnifiedResults, convertScanResultsToUnifiedRules, generateUID, getToolData);
};
