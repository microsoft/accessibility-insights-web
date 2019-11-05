// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PlatformData } from 'common/types/store-data/unified-data-interface';
import { ScanResults } from './scan-results';

export type ConvertScanResultsToPlatformDataDelegate = (scanResults: ScanResults) => PlatformData;

export function convertScanResultsToPlatformData(scanResults: ScanResults): PlatformData | null {
    if (scanResults == null || scanResults.axeDevice == null) {
        return null;
    }

    return {
        deviceName: scanResults.axeDevice.name,
        osInfo: {
            name: 'Android',
            version: scanResults.axeDevice.osVersion,
        },
        viewPortInfo: {
            width: scanResults.axeDevice.screenWidth,
            height: scanResults.axeDevice.screenHeight,
            dpi: scanResults.axeDevice.dpi,
        },
    };
}
