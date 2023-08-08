// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { generateUID } from 'common/uid-generator';
import { ToolDataDelegateNew } from 'electron/common/application-properties-provider';
import {
    convertScanResultsToPlatformData,
    ConvertScanResultsToPlatformDataDelegate,
} from 'electron/platform/electron/scan-results-to-platform-data';
import { getCheckResolution, getFixResolution } from 'injected/adapters/resolution-creator';
import {
    ConvertScanResultsToUnifiedResults,
    ConvertScanResultsToUnifiedResultsDelegate,
} from 'injected/adapters/scan-results-to-unified-results';
import {
    convertScanResultsToUnifiedRules,
    ConvertScanResultsToUnifiedRulesDelegate,
} from 'injected/adapters/scan-results-to-unified-rules';

export type UnifiedScanCompletedPayloadBuilder = (
    scanResults: AxeAnalyzerResult,
) => UnifiedScanCompletedPayload;

export const createBuilder = (
    getUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate,
    getUnifiedRules: ConvertScanResultsToUnifiedRulesDelegate,
    getPlatformData: ConvertScanResultsToPlatformDataDelegate,
    getToolData: ToolDataDelegateNew,
) => (scanResults: AxeAnalyzerResult): UnifiedScanCompletedPayload => {
    const payload: UnifiedScanCompletedPayload = {
        scanResult: getUnifiedResults(scanResults.originalResult),
        rules: getUnifiedRules(scanResults.originalResult),
        platformInfo: getPlatformData(scanResults),
        toolInfo: getToolData(scanResults),
        timestamp: scanResults.originalResult.timestamp,
        targetAppInfo: {
            name: scanResults.originalResult.targetPageUrl,
        },
        scanIncompleteWarnings: [],
        screenshotData: null,
    };
    return payload;
};

export const createDefaultBuilder = (getToolData: ToolDataDelegateNew) => {
    const convertScanResultsToUnifiedResults = new ConvertScanResultsToUnifiedResults(
        generateUID,
        getFixResolution,
        getCheckResolution,
    );

    return createBuilder(
        convertScanResultsToUnifiedResults.automatedChecksConversion,
        convertScanResultsToUnifiedRules,
        convertScanResultsToPlatformData,
        getToolData,
    );
};
