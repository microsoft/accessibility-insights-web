// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformData } from 'common/types/store-data/unified-data-interface';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidScanResults } from './android-scan-results';

export type ConvertScanResultsToPlatformDataDelegate = (
    scanResults: AndroidScanResults,
    friendlyDeviceNameProvider: AndroidFriendlyDeviceNameProvider,
) => PlatformData | null;

export function convertScanResultsToPlatformData(
    scanResults: AndroidScanResults,
    friendlyNameProvider: AndroidFriendlyDeviceNameProvider,
): PlatformData | null {
    if (scanResults == null || scanResults.deviceInfo == null) {
        return null;
    }

    return {
        deviceName: friendlyNameProvider.getFriendlyName(scanResults.deviceInfo.name),
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
