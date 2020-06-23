// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
} from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let serviceConfigFactoryMock: IMock<AndroidServiceConfiguratorFactory>;
    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let configStoreMock: IMock<UserConfigurationStore>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let configMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let fetchConfigMock: IMock<DeviceConfigFetcher>;
    let loggerMock: IMock<Logger>;
    let testSubject: LiveAndroidSetupDeps;

    beforeEach(() => {
        serviceConfigFactoryMock = Mock.ofType<AndroidServiceConfiguratorFactory>(
            undefined,
            MockBehavior.Strict,
        );
        serviceConfigMock = Mock.ofType<AndroidServiceConfigurator>(undefined, MockBehavior.Strict);
        configStoreMock = Mock.ofType<UserConfigurationStore>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        configMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        fetchConfigMock = Mock.ofInstance((port: number) => new Promise<DeviceConfig>(() => null));
        loggerMock = Mock.ofType<Logger>();
        testSubject = new LiveAndroidSetupDeps(
            serviceConfigFactoryMock.object,
            configStoreMock.object,
            apkLocatorMock.object,
            configMessageCreatorMock.object,
            fetchConfigMock.object,
            loggerMock.object,
        );
    });

    function verifyAllMocks(): void {
        serviceConfigFactoryMock.verifyAll();
        serviceConfigMock.verifyAll();
        configStoreMock.verifyAll();
        configMessageCreatorMock.verifyAll();
        apkLocatorMock.verifyAll();
    }

    async function initializeServiceConfig(): Promise<void> {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfigurator(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());
        serviceConfigMock.setup((m: any) => m.then).returns(() => undefined);
        await testSubject.hasAdbPath();
    }

    it('hasAdbPath returns false on error', async () => {
        configStoreMock
            .setup(m => m.getState())
            .throws(new Error('Threw during hasAdbPath'))
            .verifiable(Times.once());

        const success: boolean = await testSubject.hasAdbPath();
        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasAdbPath chains and returns true on success', async () => {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;

        serviceConfigMock.setup((m: any) => m.then).returns(() => undefined);
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfigurator(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());

        const success: boolean = await testSubject.hasAdbPath();
        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setAdbPath chains to UserConfigMessageCreator', () => {
        configMessageCreatorMock
            .setup(m => m.setAdbLocation(expectedAdbLocation))
            .verifiable(Times.once());

        testSubject.setAdbPath(expectedAdbLocation);

        verifyAllMocks();
    });

    it('getDevices returns info from AndroidServiceConfigurator', async () => {
        const expectedDevices: DeviceInfo[] = [
            {
                id: 'emulator1',
                isEmulator: true,
                friendlyName: 'an emulator',
            },
            {
                id: 'phone123',
                isEmulator: false,
                friendlyName: 'a device',
            },
        ];
        serviceConfigMock
            .setup(m => m.getConnectedDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());

        await initializeServiceConfig();
        const actualDevices = await testSubject.getDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDeviceId persists correctly', async () => {
        // Note: We can only validate this indirectly. We set the expected ID,
        // then confirm that it gets passed to getPackageInfo.
        const expectedDeviceId: string = 'abc-123';
        serviceConfigMock
            .setup(m => m.getPackageInfo(expectedDeviceId))
            .throws(new Error('Threw validating setSeletedDeviceId'))
            .verifiable(Times.once());

        await initializeServiceConfig();
        testSubject.setSelectedDeviceId(expectedDeviceId);
        await testSubject.hasExpectedServiceVersion();

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .throws(new Error('Threw during hasExpectedServiceVersion'))
            .verifiable(Times.once());

        await initializeServiceConfig();
        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if installed package has no versionName', async () => {
        const packageInfo: PackageInfo = {};
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if versionNames are different', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns true if versionNames are same', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .throws(new Error('Threw during installService'))
            .verifiable(Times.once());

        await initializeServiceConfig();
        const success = await testSubject.installService();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('installService installs (no uninstall) if installed version does not exist', async () => {
        const installedPackageInfo: PackageInfo = {};
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(undefined)).verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService installs (no uninstall) if installed version is older than Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(undefined)).verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService installs (no uninstall) if installed version is same as Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(undefined)).verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService uninstalls then installs if installed version is newer than Apk version', async () => {
        let callbackCount: number = 0;
        let uninstallOrder: number = undefined;
        let installOrder: number = undefined;
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.2',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(undefined))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.uninstallService(undefined))
            .callback(() => {
                uninstallOrder = callbackCount++;
            })
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(undefined))
            .callback(() => {
                installOrder = callbackCount++;
            })
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);
        expect(uninstallOrder).toBe(0);
        expect(installOrder).toBe(1);
        expect(callbackCount).toBe(2);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.getPermissionInfo(undefined))
            .throws(new Error('Threw during hasExpectedPermissions'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        const permissionInfo: PermissionInfo = {
            screenshotGranted: false,
        };
        serviceConfigMock
            .setup(m => m.getPermissionInfo(undefined))
            .returns(() => Promise.resolve(permissionInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        const permissionInfo: PermissionInfo = {
            screenshotGranted: true,
        };
        serviceConfigMock
            .setup(m => m.getPermissionInfo(undefined))
            .returns(() => Promise.resolve(permissionInfo))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setTcpForwarding propagates error from serviceConfig.setTcpForwarding', async () => {
        const deviceId = 'id1';
        const serviceConfigErrorMessage = 'error from serviceConfig';
        serviceConfigMock
            .setup(m => m.setTcpForwarding(deviceId))
            .returns(() => Promise.reject(new Error(serviceConfigErrorMessage)))
            .verifiable(Times.once());

        await initializeServiceConfig();

        testSubject.setSelectedDeviceId(deviceId);
        await expect(testSubject.setTcpForwarding()).rejects.toThrowError(
            serviceConfigErrorMessage,
        );

        verifyAllMocks();
    });

    it('setTcpForwarding propagates output from serviceConfig.setTcpForwarding', async () => {
        const deviceId = 'id1';
        const serviceConfigOutput = 63000;
        serviceConfigMock
            .setup(m => m.setTcpForwarding(deviceId))
            .returns(() => Promise.resolve(serviceConfigOutput))
            .verifiable(Times.once());
        await initializeServiceConfig();

        testSubject.setSelectedDeviceId(deviceId);
        const output = await testSubject.setTcpForwarding();

        expect(output).toBe(serviceConfigOutput);

        verifyAllMocks();
    });
});
