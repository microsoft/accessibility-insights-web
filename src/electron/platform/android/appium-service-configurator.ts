// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { DictionaryStringTo } from 'types/common-types';

type AdbDevice = {
    udid: string;
};

const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';

export class AppiumServiceConfigurator implements AndroidServiceConfigurator {
    constructor(private readonly adb: ADB, private readonly apkLocator: AndroidServiceApkLocator) {}

    public getConnectedDevices = async (): Promise<Array<DeviceInfo>> => {
        const detectedDevices: DictionaryStringTo<DeviceInfo> = {};
        await this.addDevices(await this.adb.getConnectedEmulators(), true, detectedDevices);
        await this.addDevices(await this.adb.getConnectedDevices(), false, detectedDevices);

        return Object.values(detectedDevices);
    };

    private async addDevices(
        devices: Array<AdbDevice>,
        isEmulator: boolean,
        detectedDevices: DictionaryStringTo<DeviceInfo>,
    ): Promise<void> {
        for (const device of devices) {
            const id = device.udid;
            if (!detectedDevices[id]) {
                const deviceInfo: DeviceInfo = await this.getDeviceInfo(id, isEmulator);
                detectedDevices[id] = deviceInfo;
            }
        }
    }

    private async getDeviceInfo(id: string, isEmulator: boolean): Promise<DeviceInfo> {
        this.adb.setDeviceId(id);
        const friendlyName = await this.adb.getModel();
        return { id, isEmulator, friendlyName };
    }

    public getPackageInfo = async (deviceId: string): Promise<PackageInfo> => {
        this.adb.setDeviceId(deviceId);
        const info: PackageInfo = await this.adb.getPackageInfo(servicePackageName);
        return {
            versionCode: info?.versionCode,
            versionName: info?.versionName,
        };
    };

    public getPermissionInfo = async (deviceId: string): Promise<PermissionInfo> => {
        const dumpsys = 'dumpsys';

        this.adb.setDeviceId(deviceId);
        let stdout: string = await this.adb.shell([dumpsys, 'accessibility']);
        if (!stdout.includes('label=Accessibility Insights')) {
            throw new Error('Accessibility Insights for Android Service is not running');
        }
        stdout = await this.adb.shell([dumpsys, 'media_projection']);
        const screenshotGranted: boolean = stdout.includes(servicePackageName);
        return { screenshotGranted };
    };

    public installService = async (deviceId: string): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        const pathToApk = (await this.apkLocator.locateBundledApk()).path;
        await this.adb.install(pathToApk);
    };

    public uninstallService = async (deviceId: string): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.uninstallApk(servicePackageName);
    };

    public setTcpForwarding = async (
        deviceId: string,
        localPort: number,
        devicePort: number,
    ): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.forwardPort(deviceId, localPort, devicePort);
    };

    public removeTcpForwarding = async (deviceId: string, localPort: number): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.removePortForward(localPort);
    };
}
