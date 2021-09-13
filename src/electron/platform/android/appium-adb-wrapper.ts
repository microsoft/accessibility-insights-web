// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AdbWrapper,
    DeviceInfo,
    KeyEventCode,
    PackageInfo,
} from 'electron/platform/android/adb-wrapper';
import { DictionaryStringTo } from 'types/common-types';

type AdbDevice = {
    udid: string;
};

export class AppiumAdbWrapper implements AdbWrapper {
    constructor(private readonly adb: ADB) {}

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

    public getPackageInfo = async (deviceId: string, packageName: string): Promise<PackageInfo> => {
        this.adb.setDeviceId(deviceId);
        const info: PackageInfo = await this.adb.getPackageInfo(packageName);
        return {
            versionCode: info?.versionCode,
            versionName: info?.versionName,
        };
    };

    public getDumpsysOutput = async (deviceId: string, serviceToQuery: string): Promise<string> => {
        this.adb.setDeviceId(deviceId);
        return await this.adb.shell(['dumpsys', serviceToQuery]);
    };

    public installService = async (deviceId: string, apkLocation: string): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.install(apkLocation);
    };

    public uninstallService = async (deviceId: string, packageName: string): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.uninstallApk(packageName);
    };

    public sendKeyEvent = async (deviceId: string, keyEventCode: KeyEventCode): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.shell(['input', 'keyevent', keyEventCode]);
    };

    public grantPermission = async (
        deviceId: string,
        packageName: string,
        permission: string,
    ): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.shell(['cmd', 'appops', 'reset', packageName]);
        await this.adb.shell(['pm', 'grant', packageName, permission]);
    };

    public hasPermission = async (
        deviceId: string,
        permissionName: string,
        matchString: string,
    ): Promise<boolean> => {
        const output: string = await this.getDumpsysOutput(deviceId, permissionName);
        return output.includes(matchString);
    };

    public readContent = async (deviceId: string, contentUri: string): Promise<string> => {
        this.adb.setDeviceId(deviceId);
        return await this.adb.shell(['content', 'read', '--uri', contentUri]);
    };

    public callContent = async (
        deviceId: string,
        contentUri: string,
        command: string,
    ): Promise<void> => {
        this.adb.setDeviceId(deviceId);
        await this.adb.shell(['content', 'call', '--uri', contentUri, '--method', command]);
    };
}
