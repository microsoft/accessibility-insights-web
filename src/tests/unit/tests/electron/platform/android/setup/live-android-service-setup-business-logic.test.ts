// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
} from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    DeviceInfo,
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { LiveAndroidServiceSetupBusinessLogic } from 'electron/platform/android/setup/live-android-service-setup-business-logic';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const testDeviceId: string = 'emulator-12345';
    const localPortNumber: number = 62442;
    const devicePortNumber: number = 62442;

    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let loggerMock: IMock<Logger>;
    let testSubject: LiveAndroidServiceSetupBusinessLogic;

    beforeEach(() => {
        serviceConfigMock = Mock.ofType<AndroidServiceConfigurator>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>();
        testSubject = new LiveAndroidServiceSetupBusinessLogic(
            serviceConfigMock.object,
            apkLocatorMock.object,
            loggerMock.object,
        );
    });

    function verifyAllMocks(): void {
        serviceConfigMock.verifyAll();
        apkLocatorMock.verifyAll();
    }

    it('getDevices propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during getDevices';
        serviceConfigMock
            .setup(m => m.getConnectedDevices())
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getDevices()).rejects.toThrowError(expectedMessage);

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

        const actualDevices = await testSubject.getDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredServiceVersion';
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredServiceVersion(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns false if installed package has no versionName', async () => {
        const packageInfo: PackageInfo = {};
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns false if versionNames are different', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns true if versionNames are same', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion(testDeviceId);

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during installRequiredServiceVersion';
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installRequiredServiceVersion(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version does not exist', async () => {
        const installedPackageInfo: PackageInfo = {};
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(testDeviceId)).verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is older than Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2.3',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(testDeviceId)).verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is same as Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2',
        };
        const apkInfo: AndroidServiceApkInfo = {
            versionName: '1.2',
        } as AndroidServiceApkInfo;
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock.setup(m => m.installService(testDeviceId)).verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion uninstalls then installs if installed version is newer than Apk version', async () => {
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
            .setup(m => m.getPackageInfo(testDeviceId))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.uninstallService(testDeviceId))
            .callback(() => {
                uninstallOrder = callbackCount++;
            })
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(testDeviceId))
            .callback(() => {
                installOrder = callbackCount++;
            })
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        expect(uninstallOrder).toBe(0);
        expect(installOrder).toBe(1);
        expect(callbackCount).toBe(2);

        verifyAllMocks();
    });

    it('hasRequiredPermissions propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredPermissions';
        serviceConfigMock
            .setup(m => m.getPermissionInfo(testDeviceId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredPermissions(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false on when config returns false', async () => {
        const permissionInfo: PermissionInfo = {
            screenshotGranted: false,
        };
        serviceConfigMock
            .setup(m => m.getPermissionInfo(testDeviceId))
            .returns(() => Promise.resolve(permissionInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns true when config returns true', async () => {
        const permissionInfo: PermissionInfo = {
            screenshotGranted: true,
        };
        serviceConfigMock
            .setup(m => m.getPermissionInfo(testDeviceId))
            .returns(() => Promise.resolve(permissionInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions(testDeviceId);

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setTcpForwarding propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during setTcpForwarding';
        serviceConfigMock
            .setup(m => m.setTcpForwarding(testDeviceId, localPortNumber, devicePortNumber))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.setTcpForwarding(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('setTcpForwarding returns if no error', async () => {
        serviceConfigMock
            .setup(m => m.setTcpForwarding(testDeviceId, localPortNumber, devicePortNumber))
            .verifiable(Times.once());

        await testSubject.setTcpForwarding(testDeviceId);

        verifyAllMocks();
    });

    it('removeTcpForwarding propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during removeTcpForwarding';
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(testDeviceId, localPortNumber))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.removeTcpForwarding(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('removeTcpForwarding returns if no error', async () => {
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(testDeviceId, localPortNumber))
            .verifiable(Times.once());

        await testSubject.removeTcpForwarding(testDeviceId);

        verifyAllMocks();
    });
});
