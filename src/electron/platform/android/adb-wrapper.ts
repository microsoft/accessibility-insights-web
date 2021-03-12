// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type DeviceInfo = {
    id: string;
    isEmulator: boolean;
    friendlyName: string;
};

export type PackageInfo = {
    versionCode?: number;
    versionName?: string;
};

export enum KeyEventCode {
    Up = 19,
    Down = 20,
    Left = 21,
    Right = 22,
    Tab = 61,
    Enter = 66,
}

export interface AdbWrapper {
    getConnectedDevices(): Promise<Array<DeviceInfo>>;
    getPackageInfo(deviceId: string, packageName: string): Promise<PackageInfo>;
    getDumpsysOutput(deviceId: string, serviceToQuery: string): Promise<string>;
    installService(deviceId: string, apkLocation: string): Promise<void>;
    uninstallService(deviceId: string, packageName: string): Promise<void>;
    setTcpForwarding(deviceId: string, localPort: number, devicePort: number): Promise<number>;
    removeTcpForwarding(deviceId: string, devicePort: number): Promise<void>;
    sendKeyEvent(deviceId: string, keyEventCode: KeyEventCode): Promise<void>;
    grantOverlayPermission: (deviceId: string, packageName: string) => Promise<void>;
}

export interface AdbWrapperFactory {
    createValidatedAdbWrapper(sdkRoot: string): Promise<AdbWrapper>;
}
