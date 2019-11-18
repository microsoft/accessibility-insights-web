// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { generateUID, UUIDGeneratorType } from 'common/uid-generator';
import { ToolDataGetter } from 'electron/common/application-properties-provider';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { ScanResults } from 'electron/platform/android/scan-results';
import {
    convertScanResultsToPlatformData,
    ConvertScanResultsToPlatformDataDelegate,
} from 'electron/platform/android/scan-results-to-platform-data';
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
    getPlatformData: ConvertScanResultsToPlatformDataDelegate,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGeneratorType,
    getToolData: ToolDataGetter,
) => (scanResults: ScanResults): UnifiedScanCompletedPayload => {
    const payload: UnifiedScanCompletedPayload = {
        scanResult: getUnifiedResults(scanResults, ruleInformationProvider, uuidGenerator),
        rules: getUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator),
        platformInfo: getPlatformData(scanResults),
        toolInfo: getToolData(scanResults),
        targetAppInfo: {
            name: scanResults.appIdentifier,
        },
        screenshotData: scanResults.screenshot,
    };
    return payload;
};

export const createDefaultBuilder = (getToolData: ToolDataGetter) => {
    return createBuilder(
        convertScanResultsToUnifiedResults,
        convertScanResultsToUnifiedRules,
        convertScanResultsToPlatformData,
        new RuleInformationProvider(),
        generateUID,
        getToolData,
    );
};
