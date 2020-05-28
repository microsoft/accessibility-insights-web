// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type DeviceInfo = {
    id: string;
    isEmulator: boolean;
    friendlyName: string;
};

export type PackageInfo = {
    version: string;
};

export type PermissionInfo = {
    screenshotGranted: boolean;
};

export interface AndroidServiceConfigurator {
    getConnectedDevices(): Promise<Array<DeviceInfo>>;
    getPackageInfo(deviceId: string): Promise<PackageInfo>;
    getPermissionInfo(deviceId: string): Promise<PermissionInfo>;
    installService(deviceId: string): Promise<void>;
    setTcpForwarding(deviceId: string): Promise<void>;
}

export interface AndroidServiceConfiguratorFactory {
    getServiceConfigurator(adbFileLocation: string): Promise<AndroidServiceConfigurator>;
}
