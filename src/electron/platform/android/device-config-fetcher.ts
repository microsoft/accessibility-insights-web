// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HttpGet } from 'electron/platform/android/fetch-scan-results';
export type DeviceConfigFetcher = (port: number) => Promise<DeviceConfig>;

export class DeviceConfig {
    constructor(readonly rawData: any) {}

    public get deviceName(): string {
        try {
            return this.rawData.deviceName;
        } catch {
            return null;
        }
    }

    public get appIdentifier(): string {
        try {
            return this.rawData.packageName;
        } catch {
            return null;
        }
    }
}

export const createDeviceConfigFetcher = (httpGet: HttpGet): DeviceConfigFetcher => {
    return async (port: number) => {
        const response = await httpGet(`http://localhost:${port}/AccessibilityInsights/config`);
        return new DeviceConfig(response.data);
    };
};
