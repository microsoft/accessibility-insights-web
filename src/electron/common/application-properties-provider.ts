// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createToolData } from 'common/application-properties-provider';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';

export type ToolDataDelegate = (scanResults: AndroidScanResults) => ToolData;

export const createGetToolDataDelegate = (
    toolName: string,
    toolVersion: string,
    scanEngineName: string,
): ToolDataDelegate => {
    return scanResults => {
        return createToolData(scanEngineName, scanResults.axeVersion, toolName, toolVersion);
    };
};
