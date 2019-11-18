// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { androidAppTitle } from 'content/strings/application';
import { ScanResults } from 'electron/platform/android/scan-results';

export type ToolDataGetter = (scanResults: ScanResults) => ToolData;

export const createToolDataGetter = (appDataAdapter: AppDataAdapter): ToolDataGetter => {
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
