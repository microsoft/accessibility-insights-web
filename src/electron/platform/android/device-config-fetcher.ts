// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConfig, DeviceConfigParser } from 'electron/platform/android/device-config';
import { HttpGet } from 'electron/platform/android/fetch-scan-results';

export const DEVICE_CONFIG_FETCH_TIMEOUT_MS = 5000;

export type DeviceConfigFetcher = (port: number) => Promise<DeviceConfig>;

export const createDeviceConfigFetcher = (
    httpGet: HttpGet,
    parser: DeviceConfigParser,
): DeviceConfigFetcher => {
    return async (port: number) => {
        const response = await httpGet(`http://localhost:${port}/AccessibilityInsights/config`, {
            timeout: DEVICE_CONFIG_FETCH_TIMEOUT_MS,
        });

        if (response.status !== 200) {
            throw new Error(
                `Invalid DeviceConfig response: ${response.status}: ${response.statusText}`,
            );
        }

        return parser(response.data);
    };
};
