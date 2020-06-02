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

export class AppiumServiceConfigurator implements AndroidServiceConfigurator {
    private readonly adb: ADB;

    constructor(adb: ADB) {
        this.adb = adb;
    }

    public getConnectedDevices = (): Promise<Array<DeviceInfo>> => {
        return new Promise<Array<DeviceInfo>>(async (resolve, reject) => {
            try {
                // First add devices that are flagged as emulator, then
                // add devices that aren't flagged as eulators
                const detectedDevices = {};
                await this.AddDevices(
                    await this.adb.getConnectedEmulators(),
                    true,
                    detectedDevices,
                );
                await this.AddDevices(await this.adb.getConnectedDevices(), false, detectedDevices);

                const output: Array<DeviceInfo> = [];
                Object.values(detectedDevices).forEach(device => output.push(device as DeviceInfo));
                resolve(output);
            } catch (error) {
                reject(error);
            }
        });
    };

    private AddDevices(
        devices: Array<AdbDevice>,
        isEmulator: boolean,
        detectedDevices: any,
    ): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                for (let loop = 0; loop < devices.length; loop++) {
                    const id = devices[loop].udid;
                    if (!detectedDevices[id]) {
                        const deviceInfo: DeviceInfo = await this.getDeviceInfo(id, isEmulator);
                        detectedDevices[id] = deviceInfo;
                    }
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    private getDeviceInfo(id: string, isEmulator: boolean): Promise<DeviceInfo> {
        return new Promise<DeviceInfo>(async (resolve, reject) => {
            try {
                this.adb.setDeviceId(id);
                const friendlyName = await this.adb.getModel();
                resolve({ id, isEmulator, friendlyName });
            } catch (err) {
                reject(err);
            }
        });
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
