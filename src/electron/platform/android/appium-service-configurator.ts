// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceConfigurator,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';

export class AppiumServiceConfigurator implements AndroidServiceConfigurator {
    private readonly adb: ADB;

    constructor(adb: ADB) {
        this.adb = adb;
    }

    public getConnectedDevices(): Promise<Array<DeviceInfo>> {
        return null;
    }

    public getPackageInfo(deviceId: string): Promise<PackageInfo> {
        return null;
    }

    public getPermissionInfo(deviceId: string): Promise<PermissionInfo> {
        return null;
    }

    public installService(deviceId: string): Promise<void> {
        return null;
    }

    public setTcpForwarding(deviceId: string): Promise<void> {
        return null;
    }
}
