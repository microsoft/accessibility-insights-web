// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, DeviceInfo, PackageInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { PortFinderOptions } from 'portfinder';

export type PortFinder = (options?: PortFinderOptions) => Promise<number>;

const servicePortNumber: number = 62442;

export interface ServiceConfigurator {
    getConnectedDevices(): Promise<DeviceInfo[]>;
    setSelectedDevice(deviceId: string): void;
    hasRequiredServiceVersion(): Promise<boolean>;
    installRequiredServiceVersion(): Promise<void>;
    hasRequiredPermissions(): Promise<boolean>;
    grantOverlayPermission(): Promise<void>;
    setupTcpForwarding(): Promise<number>;
    removeTcpForwarding(hostPort: number): Promise<void>;
}

export class AndroidServiceConfigurator implements ServiceConfigurator {
    private readonly servicePackageName: string =
        'com.microsoft.accessibilityinsightsforandroidservice';

    private selectedDeviceId: string;

    public constructor(
        private readonly adbWrapper: AdbWrapper,
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly portFinder: PortFinder,
        private readonly friendlyDeviceNameProvider: AndroidFriendlyDeviceNameProvider,
    ) {}

    public getConnectedDevices = async (): Promise<DeviceInfo[]> => {
        // Devices reported from ADB have model names--convert them to friendly names if possible
        const adbDevices: DeviceInfo[] = await this.adbWrapper.getConnectedDevices();
        const friendlyDevices: DeviceInfo[] = [];

        adbDevices.forEach(rawDevice => {
            friendlyDevices.push({
                id: rawDevice.id,
                isEmulator: rawDevice.isEmulator,
                friendlyName: this.friendlyDeviceNameProvider.getFriendlyName(
                    rawDevice.friendlyName,
                ),
            });
        });
        return friendlyDevices;
    };

    public setSelectedDevice = (deviceId: string): void => {
        this.selectedDeviceId = deviceId;
    };

    public hasRequiredServiceVersion = async (): Promise<boolean> => {
        const installedVersion = await this.getInstalledVersion(this.selectedDeviceId);
        if (installedVersion) {
            const targetVersion = (await this.apkLocator.locateBundledApk()).versionName;
            return installedVersion === targetVersion;
        }

        return false;
    };

    public installRequiredServiceVersion = async (): Promise<void> => {
        const deviceId: string = this.selectedDeviceId; // Prevent changes during execution
        const installedVersion = await this.getInstalledVersion(deviceId);
        const apkInfo = await this.apkLocator.locateBundledApk();
        if (installedVersion) {
            const targetVersion: string = apkInfo.versionName;
            if (this.compareVersions(installedVersion, targetVersion) > 0) {
                await this.adbWrapper.uninstallService(deviceId, this.servicePackageName);
            }
        }

        const pathToApk = apkInfo.path;
        await this.adbWrapper.installService(deviceId, pathToApk);
    };

    public hasRequiredPermissions = async (): Promise<boolean> => {
        const deviceId: string = this.selectedDeviceId; // Prevent changes during execution
        const accessibilityOutput: string = await this.adbWrapper.getDumpsysOutput(
            deviceId,
            'accessibility',
        );

        if (!accessibilityOutput.includes('label=Accessibility Insights')) {
            return false;
        }

        const mediaProjectionOutput: string = await this.adbWrapper.getDumpsysOutput(
            deviceId,
            'media_projection',
        );
        const screenshotGranted: boolean = mediaProjectionOutput.includes(this.servicePackageName);
        return screenshotGranted;
    };

    public grantOverlayPermission = async (): Promise<void> => {
        return await this.adbWrapper.grantOverlayPermission(
            this.selectedDeviceId,
            this.servicePackageName,
        );
    };

    public setupTcpForwarding = async (): Promise<number> => {
        const hostPort = await this.portFinder({
            port: servicePortNumber,
            stopPort: servicePortNumber + 100,
        });

        return await this.adbWrapper.setTcpForwarding(
            this.selectedDeviceId,
            hostPort,
            servicePortNumber,
        );
    };

    public removeTcpForwarding = async (hostPort: number): Promise<void> => {
        return await this.adbWrapper.removeTcpForwarding(this.selectedDeviceId, hostPort);
    };

    private async getInstalledVersion(deviceId: string): Promise<string | undefined> {
        const info: PackageInfo = await this.adbWrapper.getPackageInfo(
            deviceId,
            this.servicePackageName,
        );
        return info?.versionName;
    }

    private compareVersions(v1: string, v2: string): number {
        const radix: number = 10;
        const v1Parts: string[] = v1.split('.');
        const v2Parts: string[] = v2.split('.');

        for (let loop = 0; loop < 3; loop++) {
            const v1Part = v1Parts[loop];
            const v2Part = v2Parts[loop];

            if (!v1Part && !v2Part) {
                break;
            }
            const v1Value = parseInt(v1Part, radix);
            const v2Value = parseInt(v2Part, radix);

            if (v1Value > v2Value) {
                return 1;
            }
            if (v1Value < v2Value) {
                return -1;
            }
        }

        return 0;
    }
}
