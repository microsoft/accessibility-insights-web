// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { compareSemverValues, SemverComparisonResult } from 'electron/common/semver-comparer';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private serviceConfig: AndroidServiceConfigurator;
    private selectedDeviceId: string;

    constructor(
        private readonly configFactory: AndroidServiceConfiguratorFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly logger: Logger,
    ) {}

    public hasAdbPath = async (): Promise<boolean> => {
        try {
            const adbLocation = this.configStore.getState().adbLocation;
            this.serviceConfig = await this.configFactory.getServiceConfigurator(adbLocation);
            return true;
        } catch (error) {
            this.logger.log(error);
            return false;
        }
    };

    public setAdbPath = (path: string): void => {
        this.configStore.getState().adbLocation = path;
    };

    public getDevices = async (): Promise<DeviceInfo[]> => {
        return await this.serviceConfig.getConnectedDevices();
    };

    public setSelectedDeviceId = (id: string): void => {
        this.selectedDeviceId = id;
    };

    public hasExpectedServiceVersion = async (): Promise<boolean> => {
        try {
            const installedVersion: string = await this.getInstalledVersion();
            if (installedVersion) {
                return installedVersion === (await this.getTargetVersion());
            }
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            let needsUninstall: boolean = true; // Until proven otherwise
            const installedVersion: string = await this.getInstalledVersion();
            if (installedVersion) {
                const targetVersion: string = await this.getTargetVersion();
                if (
                    compareSemverValues(targetVersion, installedVersion) ===
                    SemverComparisonResult.V1GreaterThanV2
                ) {
                    needsUninstall = false;
                }
            }

            if (needsUninstall) {
                await this.serviceConfig.uninstallService(this.selectedDeviceId);
            }
            await this.serviceConfig.installService(this.selectedDeviceId);
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public hasExpectedPermissions = async (): Promise<boolean> => {
        try {
            const info: PermissionInfo = await this.serviceConfig.getPermissionInfo(
                this.selectedDeviceId,
            );
            return info.screenshotGranted;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    private async getInstalledVersion(): Promise<string> {
        const info: PackageInfo = await this.serviceConfig.getPackageInfo(this.selectedDeviceId);
        return info?.versionName;
    }

    private async getTargetVersion(): Promise<string> {
        return (await this.apkLocator.locateBundledApk()).versionName;
    }
}
