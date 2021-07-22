// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { generateUID, UUIDGenerator } from 'common/uid-generator';
import { ToolDataDelegate } from 'electron/common/application-properties-provider';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { convertAtfaScanResultsToUnifiedResults } from 'electron/platform/android/atfa-scan-results-to-unified-results';
import { convertAtfaScanResultsToUnifiedRules } from 'electron/platform/android/atfa-scan-results-to-unified-rules';
import { convertAxeScanResultsToUnifiedResults } from 'electron/platform/android/axe-scan-results-to-unified-results';
import { convertAxeScanResultsToUnifiedRules } from 'electron/platform/android/axe-scan-results-to-unified-rules';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
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

export type UnifiedScanCompletedPayloadBuilder = (
    scanResults: AndroidScanResults,
) => UnifiedScanCompletedPayload;

export const createBuilder =
    (
        getUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
        getUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
        getPlatformData: ConvertScanResultsToPlatformDataDelegate,
        ruleInformationProvider: RuleInformationProviderType,
        uuidGenerator: UUIDGenerator,
        getToolData: ToolDataDelegate,
        friendlyNameProvider: AndroidFriendlyDeviceNameProvider,
    ) =>
    (scanResults: AndroidScanResults): UnifiedScanCompletedPayload => {
        const payload: UnifiedScanCompletedPayload = {
            scanResult: getUnifiedResults(scanResults, ruleInformationProvider, uuidGenerator),
            rules: getUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator),
            platformInfo: getPlatformData(scanResults, friendlyNameProvider) ?? undefined,
            toolInfo: getToolData(scanResults),
            timestamp: scanResults.analysisTimestamp ?? undefined,
            targetAppInfo: {
                name: scanResults.appIdentifier ?? undefined,
            },
            scanIncompleteWarnings: [],
            screenshotData: scanResults.screenshot ?? undefined,
        };
        return payload;
    };

export const createDefaultBuilder = (
    getToolData: ToolDataDelegate,
    friendlyNameProvider: AndroidFriendlyDeviceNameProvider,
    featureFlagsStore: FeatureFlagStore,
) => {
    return createBuilder(
        convertAllScanResultsToUnifiedResults,
        convertAllScanResultsToUnifiedRules,
        convertScanResultsToPlatformData,
        new RuleInformationProvider(),
        generateUID,
        getToolData,
        friendlyNameProvider,
    );
};

function convertAllScanResultsToUnifiedResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    return convertScanResultsToUnifiedResults(scanResults, ruleInformationProvider, uuidGenerator, [
        convertAxeScanResultsToUnifiedResults,
        convertAtfaScanResultsToUnifiedResults,
    ]);
}

function convertAllScanResultsToUnifiedRules(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedRule[] {
    return convertScanResultsToUnifiedRules(scanResults, ruleInformationProvider, uuidGenerator, [
        convertAxeScanResultsToUnifiedRules,
        convertAtfaScanResultsToUnifiedRules,
    ]);
}
