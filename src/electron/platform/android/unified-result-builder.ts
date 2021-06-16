// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { generateUID, UUIDGenerator } from 'common/uid-generator';
import { ToolDataDelegate } from 'electron/common/application-properties-provider';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
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
) => {
    return createBuilder(
        convertScanResultsToUnifiedResults,
        convertScanResultsToUnifiedRules,
        convertScanResultsToPlatformData,
        new RuleInformationProvider(),
        generateUID,
        getToolData,
        friendlyNameProvider,
    );
};
