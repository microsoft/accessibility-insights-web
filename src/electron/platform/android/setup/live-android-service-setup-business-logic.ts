// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';

export interface AndroidServiceSetupBusinessLogic {
    hasRequiredServiceVersion(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<boolean>;
    installRequiredServiceVersion(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<void>;
    hasRequiredPermissions(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<boolean>;
}

export class LiveAndroidServiceSetupBusinessLogic implements AndroidServiceSetupBusinessLogic {
    public constructor(
        private readonly logger: Logger,
        private readonly apkLocator: AndroidServiceApkLocator,
    ) {}

    public async hasRequiredServiceVersion(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<boolean> {
        try {
            const installedVersion: string = await this.getInstalledVersion(
                serviceConfig,
                deviceId,
            );
            if (installedVersion) {
                return installedVersion === (await this.getTargetVersion());
            }
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    }

    public async installRequiredServiceVersion(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<void> {
        const installedVersion: string = await this.getInstalledVersion(serviceConfig, deviceId);
        if (installedVersion) {
            const targetVersion: string = await this.getTargetVersion();
            if (this.compareVersions(installedVersion, targetVersion) > 0) {
                await serviceConfig.uninstallService(deviceId);
            }
        }

        await serviceConfig.installService(deviceId);
    }

    public async hasRequiredPermissions(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<boolean> {
        const info: PermissionInfo = await serviceConfig.getPermissionInfo(deviceId);
        return info.screenshotGranted;
    }

    private async getInstalledVersion(
        serviceConfig: AndroidServiceConfigurator,
        deviceId: string,
    ): Promise<string> {
        const info: PackageInfo = await serviceConfig.getPackageInfo(deviceId);
        return info?.versionName;
    }

    private async getTargetVersion(): Promise<string> {
        return (await this.apkLocator.locateBundledApk()).versionName;
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
