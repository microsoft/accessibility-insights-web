// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private serviceConfig: AndroidServiceConfigurator;
    private selectedDeviceId: string;

    constructor(
        private readonly configFactory: AndroidServiceConfiguratorFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly apkLocator: AndroidServiceApkLocator,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        public readonly fetchDeviceConfig: DeviceConfigFetcher,
        public readonly logger: Logger,
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

    public setAdbPath = (adbLocation: string): void => {
        this.userConfigMessageCreator.setAdbLocation(adbLocation);
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
            const installedVersion: string = await this.getInstalledVersion();
            if (installedVersion) {
                const targetVersion: string = await this.getTargetVersion();
                if (this.compareVersions(installedVersion, targetVersion) > 0) {
                    await this.serviceConfig.uninstallService(this.selectedDeviceId);
                }
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

    public setupTcpForwarding = async (): Promise<number> => {
        return await this.serviceConfig.setupTcpForwarding(this.selectedDeviceId);
    };

    public removeTcpForwarding = async (hostPort: number): Promise<void> => {
        return await this.serviceConfig.removeTcpForwarding(this.selectedDeviceId, hostPort);
    };

    private async getInstalledVersion(): Promise<string> {
        const info: PackageInfo = await this.serviceConfig.getPackageInfo(this.selectedDeviceId);
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
