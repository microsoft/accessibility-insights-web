// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
} from 'electron/platform/android/android-service-apk-locator';
import { AdbWrapper, DeviceInfo, PackageInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidServiceSetupBusinessLogic', () => {
    const testDeviceId: string = 'emulator-12345';
    const localPortNumber: number = 62442;
    const devicePortNumber: number = 62442;
    const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';
    const testApkPackage: string = './Some/Path/SomePackage.apk';
    const testApkInfo: AndroidServiceApkInfo = {
        path: testApkPackage,
        versionName: '1.2.3',
    };
    const accessibilityServiceName: string = 'accessibility';
    const mediaProjectionServiceName: string = 'media_projection';
    const serviceIsRunningResponseSnippet: string = 'label=Accessibility Insights';

    let serviceConfigMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let testSubject: AndroidServiceConfigurator;

    beforeEach(() => {
        serviceConfigMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        testSubject = new AndroidServiceConfigurator(
            serviceConfigMock.object,
            apkLocatorMock.object,
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
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
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
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
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
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns true if versionNames are same', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion(testDeviceId);

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during installRequiredServiceVersion';
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installRequiredServiceVersion(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version does not exist', async () => {
        const installedPackageInfo: PackageInfo = {};
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is older than Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is same as Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion(testDeviceId);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion uninstalls then installs if installed version is newer than Apk version', async () => {
        let callbackCount: number = 0;
        let uninstallOrder: number = undefined;
        let installOrder: number = undefined;
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.4',
        };
        serviceConfigMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.uninstallService(testDeviceId, servicePackageName))
            .callback(() => {
                uninstallOrder = callbackCount++;
            })
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .callback(() => {
                installOrder = callbackCount++;
            })
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
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
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredPermissions(testDeviceId)).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is not running', async () => {
        serviceConfigMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve('No service here!'))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is running without screenshot permission', async () => {
        serviceConfigMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve(serviceIsRunningResponseSnippet))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getDumpsysOutput(testDeviceId, mediaProjectionServiceName))
            .returns(() => Promise.resolve('Nope!'))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions(testDeviceId);

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns true if service is running with screenshot permission', async () => {
        const screenshotGranted = 'some stuff ' + servicePackageName + ' some more stuff';
        serviceConfigMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve(serviceIsRunningResponseSnippet))
            .verifiable(Times.once());
        serviceConfigMock
            .setup(m => m.getDumpsysOutput(testDeviceId, mediaProjectionServiceName))
            .returns(() => Promise.resolve(screenshotGranted))
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
