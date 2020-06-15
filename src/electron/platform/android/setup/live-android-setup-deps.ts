// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
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
    ) {}

    public hasAdbPath = async (): Promise<boolean> => {
        try {
            const adbLocation = this.configStore.getState().adbLocation;
            this.serviceConfig = await this.configFactory.getServiceConfigurator(adbLocation);
            return true;
        } catch (error) {
            // console.log(error);
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
            const info: PackageInfo = await this.serviceConfig.getPackageInfo(
                this.selectedDeviceId,
            );
            return info?.versionCode === 123; // Where should this value live?
        } catch (error) {
            // console.warn(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            await this.serviceConfig.installService(this.selectedDeviceId);
            return true;
        } catch (error) {
            console.log(error);
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
            // console.log(error);
        }
        return false;
    };
}
