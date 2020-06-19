// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
    DeviceInfo,
} from 'electron/platform/android/android-service-configurator';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidServiceSetupBusinessLogic } from 'electron/platform/android/setup/live-android-service-setup-business-logic';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private serviceConfig: AndroidServiceConfigurator;
    private selectedDeviceId: string;

    constructor(
        private readonly configFactory: AndroidServiceConfiguratorFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        private readonly logger: Logger,
        private readonly businessLogic: AndroidServiceSetupBusinessLogic,
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
            return await this.businessLogic.hasRequiredServiceVersion(
                this.serviceConfig,
                this.selectedDeviceId,
            );
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            await this.businessLogic.installRequiredServiceVersion(
                this.serviceConfig,
                this.selectedDeviceId,
            );
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public hasExpectedPermissions = async (): Promise<boolean> => {
        try {
            return await this.businessLogic.hasRequiredPermissions(
                this.serviceConfig,
                this.selectedDeviceId,
            );
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };
    public setTcpForwarding = async (): Promise<boolean> => {
        try {
            await this.serviceConfig.setTcpForwarding(this.selectedDeviceId);
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

}
