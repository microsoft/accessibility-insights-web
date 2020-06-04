// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceConfigurator,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';

type AdbDevice = {
    udid: string;
};

const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';

export class AppiumServiceConfigurator implements AndroidServiceConfigurator {
    private readonly adb: ADB;

    constructor(adb: ADB) {
        this.adb = adb;
    }

    public getConnectedDevices = async (): Promise<Array<DeviceInfo>> => {
        // First add devices that are flagged as emulator, then
        // add devices that aren't flagged as emulators
        const detectedDevices = {};
        await this.addDevices(await this.adb.getConnectedEmulators(), true, detectedDevices);
        await this.addDevices(await this.adb.getConnectedDevices(), false, detectedDevices);

        const output: Array<DeviceInfo> = [];
        Object.values(detectedDevices).forEach(device => output.push(device as DeviceInfo));
        return output;
    };

    private async addDevices(
        devices: Array<AdbDevice>,
        isEmulator: boolean,
        detectedDevices: any,
    ): Promise<void> {
        for (let loop = 0; loop < devices.length; loop++) {
            const id = devices[loop].udid;
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
        if (info?.versionCode === undefined) {
            throw new Error('Unable to obtain package version information');
        }
        return { versionCode: info.versionCode, versionName: info.versionName };
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
        const pathToApk = './ServiceForAndroid/AccessibilityInsightsforAndroidService.apk';
        this.adb.setDeviceId(deviceId);
        const stdout: string = await this.adb.adbExec(['install', '-d', pathToApk]);
        if (!stdout.includes('Success')) {
            throw new Error(stdout);
        }
    };

    public setTcpForwarding = async (deviceId: string): Promise<void> => {
        const port: number = 62442;
        this.adb.setDeviceId(deviceId);
        return this.adb.forwardPort(port, port);
    };
}
