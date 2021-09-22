// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfig } from 'electron/platform/android/device-config';

export type AndroidSetupDeps = {
    hasAdbPath: () => Promise<boolean>;
    setAdbPath: (path: string) => void;
    getDevices: () => Promise<DeviceInfo[]>;
    setSelectedDeviceId: (id: string) => void;
    hasExpectedServiceVersion: () => Promise<boolean>;
    installService: () => Promise<boolean>;
    hasExpectedPermissions: () => Promise<boolean>;
    grantOverlayPermission: () => Promise<void>;
    fetchDeviceConfig: () => Promise<DeviceConfig>;
    logger: Logger;
};
