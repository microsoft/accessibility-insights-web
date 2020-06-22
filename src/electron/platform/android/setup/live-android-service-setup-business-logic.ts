// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    DeviceInfo,
    PackageInfo,
} from 'electron/platform/android/adb-wrapper';

export interface AndroidServiceSetupBusinessLogic {
    getDevices(): Promise<DeviceInfo[]>;
    hasRequiredServiceVersion(deviceId: string): Promise<boolean>;
    installRequiredServiceVersion(deviceId: string): Promise<void>;
    hasRequiredPermissions(deviceId: string): Promise<boolean>;
    setTcpForwarding(deviceId: string): Promise<number>;
    removeTcpForwarding(deviceId: string): Promise<void>;
}

export class LiveAndroidServiceSetupBusinessLogic implements AndroidServiceSetupBusinessLogic {
    private readonly devicePort = 62442;
    private readonly localPort = 62442;
    private readonly servicePackageName: string =
        'com.microsoft.accessibilityinsightsforandroidservice';

    public constructor(
        private readonly serviceConfigurator: AndroidServiceConfigurator,
        private readonly apkLocator: AndroidServiceApkLocator,
    ) {}

    public getDevices = async (): Promise<DeviceInfo[]> => {
        return await this.serviceConfigurator.getConnectedDevices();
    };

    public hasRequiredServiceVersion = async (deviceId: string): Promise<boolean> => {
        const installedVersion: string = await this.getInstalledVersion(deviceId);
        if (installedVersion) {
            const targetVersion = (await this.apkLocator.locateBundledApk()).versionName;
            return installedVersion === targetVersion;
        }

        return false;
    };

    public installRequiredServiceVersion = async (deviceId: string): Promise<void> => {
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

    public hasRequiredPermissions = async (deviceId: string): Promise<boolean> => {
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

    public setTcpForwarding = async (deviceId: string): Promise<number> => {
        await this.serviceConfigurator.setTcpForwarding(deviceId, this.localPort, this.devicePort);
        return this.localPort;
    };

    public removeTcpForwarding = async (deviceId: string): Promise<void> => {
        return await this.serviceConfigurator.removeTcpForwarding(deviceId, this.localPort);
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
