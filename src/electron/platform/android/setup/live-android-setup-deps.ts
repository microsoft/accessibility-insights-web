// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidServiceSetupBusinessLogic } from 'electron/platform/android/setup/live-android-service-setup-business-logic';
import { AndroidServiceSetupBusinessLogicFactory } from 'electron/platform/android/setup/live-android-service-setup-business-logic-factory';

export class LiveAndroidSetupDeps implements AndroidSetupDeps {
    private selectedDeviceId: string;
    private businessLogic: AndroidServiceSetupBusinessLogic;

    constructor(
        private readonly businessLogicFactory: AndroidServiceSetupBusinessLogicFactory,
        private readonly configStore: UserConfigurationStore,
        private readonly userConfigMessageCreator: UserConfigMessageCreator,
        private readonly logger: Logger,
    ) {}

    public hasAdbPath = async (): Promise<boolean> => {
        try {
            const adbLocation = this.configStore.getState().adbLocation;
            this.businessLogic = await this.businessLogicFactory.getBusinessLogic(adbLocation);
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
        return await this.businessLogic.getDevices();
    };

    public setSelectedDeviceId = (id: string): void => {
        this.selectedDeviceId = id;
    };

    public hasExpectedServiceVersion = async (): Promise<boolean> => {
        try {
            return await this.businessLogic.hasRequiredServiceVersion(this.selectedDeviceId);
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public installService = async (): Promise<boolean> => {
        try {
            await this.businessLogic.installRequiredServiceVersion(this.selectedDeviceId);
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public hasExpectedPermissions = async (): Promise<boolean> => {
        try {
            await this.businessLogic.hasRequiredPermissions(this.selectedDeviceId);
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };

    public setTcpForwarding = async (): Promise<boolean> => {
        try {
            await this.businessLogic.setTcpForwarding(this.selectedDeviceId);
            return true;
        } catch (error) {
            this.logger.log(error);
        }
        return false;
    };
}
