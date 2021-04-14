// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';

export class PortCleaningServiceConfigurator implements ServiceConfigurator {
    constructor(
        private readonly innerObject: ServiceConfigurator,
        private readonly portCleaner: AndroidPortCleaner,
    ) {}

    public getConnectedDevices = (): Promise<DeviceInfo[]> => {
        return this.innerObject.getConnectedDevices();
    };

    public setSelectedDevice = (deviceId: string): void => {
        return this.innerObject.setSelectedDevice(deviceId);
    };

    public hasRequiredServiceVersion = (): Promise<boolean> => {
        return this.innerObject.hasRequiredServiceVersion();
    };

    public installRequiredServiceVersion = (): Promise<void> => {
        return this.innerObject.installRequiredServiceVersion();
    };

    public hasRequiredPermissions = (): Promise<boolean> => {
        return this.innerObject.hasRequiredPermissions();
    };

    public grantOverlayPermission = (): Promise<void> => {
        return this.innerObject.grantOverlayPermission();
    };

    public setupTcpForwarding = async (): Promise<number> => {
        const assignedPort = await this.innerObject.setupTcpForwarding();
        this.portCleaner.addPort(assignedPort);
        return assignedPort;
    };

    public removeTcpForwarding = async (hostPort: number): Promise<void> => {
        await this.innerObject.removeTcpForwarding(hostPort);
        this.portCleaner.removePort(hostPort);
    };
}
