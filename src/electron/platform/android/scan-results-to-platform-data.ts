// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformData } from 'common/types/store-data/unified-data-interface';
import { AndroidScanResults } from './android-scan-results';

export type ConvertScanResultsToPlatformDataDelegate = (
    scanResults: AndroidScanResults,
) => PlatformData | undefined;

export function convertScanResultsToPlatformData(
    scanResults: AndroidScanResults,
): PlatformData | undefined {
    if (scanResults == null || scanResults.deviceInfo == null) {
        return undefined;
    }

    return {
        deviceName: scanResults.deviceInfo.name,
        osInfo: {
            name: 'Android',
            version: scanResults.deviceInfo.osVersion,
        },
        viewPortInfo: {
            width: scanResults.deviceInfo.screenWidth,
            height: scanResults.deviceInfo.screenHeight,
            dpi: scanResults.deviceInfo.dpi,
        },
    };
}
