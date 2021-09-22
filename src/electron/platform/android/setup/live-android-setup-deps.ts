// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { AdbWrapper, AdbWrapperFactory, DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { DeviceConfigurator } from 'electron/platform/android/setup/android-device-configurator';
import { DeviceConfiguratorFactory } from 'electron/platform/android/setup/android-device-configurator-factory';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private deviceConfig: DeviceConfigurator;

    constructor(
        private readonly configFactory: DeviceConfiguratorFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        public readonly logger: Logger,
        private readonly adbWrapperFactory: AdbWrapperFactory,
        private readonly adbWrapperHolder: AdbWrapperHolder,
    ) {}

    public hasAdbPath = async (): Promise<boolean> => {
        try {
            const adbLocation = this.configStore.getState().adbLocation;
            const adbWrapper: AdbWrapper = await this.adbWrapperFactory.createValidatedAdbWrapper(
                adbLocation,
            );
            this.adbWrapperHolder.setAdb(adbWrapper);
            this.deviceConfig = this.configFactory.getDeviceConfigurator(adbWrapper);
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
        return await this.deviceConfig.getConnectedDevices();
    };

    public setSelectedDeviceId = (deviceId: string): void => {
        this.deviceConfig.setSelectedDevice(deviceId);
    };

    public hasExpectedServiceVersion = async (): Promise<boolean> => {
        try {
            return await this.deviceConfig.hasRequiredServiceVersion();
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            await this.deviceConfig.installRequiredServiceVersion();
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public hasExpectedPermissions = async (): Promise<boolean> => {
        try {
            return await this.deviceConfig.hasRequiredPermissions();
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public grantOverlayPermission = async (): Promise<void> => {
        try {
            return await this.deviceConfig.grantOverlayPermission();
        } catch (error) {
            this.logger.log(error);
        }
    };

    public fetchDeviceConfig = async (): Promise<DeviceConfig> => {
        return await this.deviceConfig.fetchDeviceConfig();
    };
}
