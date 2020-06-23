// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, DeviceInfo, PackageInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import { PortFinderOptions } from 'portfinder';

export type PortFinder = (options?: PortFinderOptions) => Promise<number>;

const servicePortNumber: number = 62442;

export class AndroidServiceConfigurator {
    private readonly servicePackageName: string =
        'com.microsoft.accessibilityinsightsforandroidservice';

    private selectedDeviceId: string;

    public constructor(
        private readonly serviceConfigurator: AdbWrapper,
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly portFinder: PortFinder,
    ) {}

    public getConnectedDevices = async (): Promise<DeviceInfo[]> => {
        return await this.serviceConfigurator.getConnectedDevices();
    };

    public setSelectedDevice = (deviceId: string): void => {
        this.selectedDeviceId = deviceId;
    };

    public hasRequiredServiceVersion = async (): Promise<boolean> => {
        const installedVersion: string = await this.getInstalledVersion(this.selectedDeviceId);
        if (installedVersion) {
            const targetVersion = (await this.apkLocator.locateBundledApk()).versionName;
            return installedVersion === targetVersion;
        }

        return false;
    };

    public installRequiredServiceVersion = async (): Promise<void> => {
        const deviceId: string = this.selectedDeviceId; // Prevent changes during execution
        const installedVersion: string = await this.getInstalledVersion(deviceId);
        const apkInfo = await this.apkLocator.locateBundledApk();
        if (installedVersion) {
            const targetVersion: string = apkInfo.versionName;
            if (this.compareVersions(installedVersion, targetVersion) > 0) {
                await this.serviceConfigurator.uninstallService(deviceId, this.servicePackageName);
            }
        }

        const pathToApk = apkInfo.path;
        await this.serviceConfigurator.installService(deviceId, pathToApk);
    };

    public hasRequiredPermissions = async (): Promise<boolean> => {
        const deviceId: string = this.selectedDeviceId; // Prevent changes during execution
        const accessibilityOutput: string = await this.serviceConfigurator.getDumpsysOutput(
            deviceId,
            'accessibility',
        );

        if (!accessibilityOutput.includes('label=Accessibility Insights')) {
            return false;
        }

        const mediaProjectionOutput: string = await this.serviceConfigurator.getDumpsysOutput(
            deviceId,
            'media_projection',
        );
        const screenshotGranted: boolean = mediaProjectionOutput.includes(this.servicePackageName);
        return screenshotGranted;
    };

    public setupTcpForwarding = async (): Promise<number> => {
        const hostPort = await this.portFinder({
            port: servicePortNumber,
            stopPort: servicePortNumber + 100,
        });

        return await this.serviceConfigurator.setTcpForwarding(
            this.selectedDeviceId,
            hostPort,
            servicePortNumber,
        );
    };

    public removeTcpForwarding = async (hostPort: number): Promise<void> => {
        return await this.serviceConfigurator.removeTcpForwarding(this.selectedDeviceId, hostPort);
    };

    private async getInstalledVersion(deviceId: string): Promise<string> {
        const info: PackageInfo = await this.serviceConfigurator.getPackageInfo(
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
