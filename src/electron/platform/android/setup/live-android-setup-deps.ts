// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { AdbWrapper, AdbWrapperFactory, DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private serviceConfig: ServiceConfigurator;

    constructor(
        private readonly configFactory: ServiceConfiguratorFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        public readonly fetchDeviceConfig: DeviceConfigFetcher,
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
            this.serviceConfig = this.configFactory.getServiceConfigurator(adbWrapper);
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

    public setSelectedDeviceId = (deviceId: string): void => {
        this.serviceConfig.setSelectedDevice(deviceId);
    };

    public hasExpectedServiceVersion = async (): Promise<boolean> => {
        try {
            return await this.serviceConfig.hasRequiredServiceVersion();
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            await this.serviceConfig.installRequiredServiceVersion();
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public hasExpectedPermissions = async (): Promise<boolean> => {
        try {
            return await this.serviceConfig.hasRequiredPermissions();
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public grantOverlayPermission = async (): Promise<void> => {
        try {
            return await this.serviceConfig.grantOverlayPermission();
        } catch (error) {
            this.logger.log(error);
        }
    };

    public setupTcpForwarding = async (): Promise<number> => {
        return await this.serviceConfig.setupTcpForwarding();
    };

    public removeTcpForwarding = async (hostPort: number): Promise<void> => {
        await this.serviceConfig.removeTcpForwarding(hostPort);
    };
}
