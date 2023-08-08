// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { PlatformData } from 'common/types/store-data/unified-data-interface';

export type ConvertScanResultsToPlatformDataDelegate = (
    scanResults: AxeAnalyzerResult,
) => PlatformData;

export function convertScanResultsToPlatformData(scanResults: AxeAnalyzerResult): PlatformData {
    if (scanResults == null || scanResults.originalResult == null) {
        return null;
    }

    return {
        deviceName: 'Local machine',
        osInfo: {
            name: 'Electron',
            version: 'Local OS version',
        },
        viewPortInfo: {
            width: 0,
            height: 0,
            dpi: 1,
        },
    };
}
