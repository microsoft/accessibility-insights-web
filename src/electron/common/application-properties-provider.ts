// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from 'common/application-properties-provider';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';

export type ToolDataDelegate = (scanResults: AndroidScanResults) => ToolData;

export type ToolDataDelegateNew = (scanResults: AxeAnalyzerResult) => ToolData;

export const createGetToolDataDelegate = (
    toolName: string,
    toolVersion: string,
    scanEngineName: string,
): ToolDataDelegate => {
    return scanResults => {
        return createToolData(scanEngineName, scanResults.axeVersion, toolName, toolVersion);
    };
};

export const createGetToolDataDelegateNew = (
    toolName: string,
    toolVersion: string,
    scanEngineName: string,
): ToolDataDelegateNew => {
    return scanResults => {
        return createToolData(scanEngineName, 'scan engine version', toolName, toolVersion);
    };
};
