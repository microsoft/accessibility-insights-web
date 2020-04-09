// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { androidAppTitle } from 'content/strings/application';
import { AndroidScanResults } from 'electron/platform/android/scan-results';

export type ToolDataDelegate = (scanResults: AndroidScanResults) => ToolData;

export const createGetToolDataDelegate = (appDataAdapter: AppDataAdapter): ToolDataDelegate => {
    return scanResults => {
        return {
            scanEngineProperties: {
                name: 'axe-android',
                version: scanResults.axeVersion,
            },
            applicationProperties: {
                name: androidAppTitle,
                version: appDataAdapter.getVersion(),
            },
        };
    };
};
