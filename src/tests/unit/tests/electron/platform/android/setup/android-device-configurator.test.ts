// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdbWrapper, DeviceInfo, PackageInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
    AndroidServicePackageName,
} from 'electron/platform/android/android-service-apk-locator';
import { AndroidDeviceConfigurator } from 'electron/platform/android/setup/android-device-configurator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidDeviceConfigurator', () => {
    const testDeviceId: string = 'emulator-12345';
    const servicePackageName: string = AndroidServicePackageName;
    const testApkPackage: string = './Some/Path/SomePackage.apk';
    const testApkInfo: AndroidServiceApkInfo = {
        path: testApkPackage,
        versionName: '1.2.3',
    };
    const accessibilityServiceName: string = 'accessibility';
    const mediaProjectionServiceName: string = 'media_projection';
    const serviceIsRunningResponseSnippet: string = 'label=Accessibility Insights';

    let adbWrapperMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let friendlyDeviceNameProviderMock: IMock<AndroidFriendlyDeviceNameProvider>;
    let testSubject: AndroidDeviceConfigurator;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        friendlyDeviceNameProviderMock = Mock.ofType<AndroidFriendlyDeviceNameProvider>(
            undefined,
            MockBehavior.Strict,
        );
        testSubject = new AndroidDeviceConfigurator(
            adbWrapperMock.object,
            apkLocatorMock.object,
            friendlyDeviceNameProviderMock.object,
        );
        testSubject.setSelectedDevice(testDeviceId);
    });

    function verifyAllMocks(): void {
        adbWrapperMock.verifyAll();
        apkLocatorMock.verifyAll();
        friendlyDeviceNameProviderMock.verifyAll();
    }

    it('getConnectedDevices propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during getDevices';
        adbWrapperMock
            .setup(m => m.getConnectedDevices())
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getConnectedDevices()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('getConnectedDevices returns info from AdbWrapper and friendly device names', async () => {
        const rawFriendlyName1 = 'an emulator';
        const rawFriendlyName2 = 'a device';
        const friendlyName2 = 'A branded device';
        const expectedDevices: DeviceInfo[] = [
            {
                id: 'emulator1',
                isEmulator: true,
                friendlyName: rawFriendlyName1,
            },
            {
                id: 'phone123',
                isEmulator: false,
                friendlyName: rawFriendlyName2,
            },
        ];
        adbWrapperMock
            .setup(m => m.getConnectedDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());
        friendlyDeviceNameProviderMock
            .setup(m => m.getFriendlyName(rawFriendlyName1))
            .returns(() => rawFriendlyName1)
            .verifiable(Times.once());
        friendlyDeviceNameProviderMock
            .setup(m => m.getFriendlyName(rawFriendlyName2))
            .returns(() => friendlyName2)
            .verifiable(Times.once());

        const actualDevices = await testSubject.getConnectedDevices();

        expect(actualDevices[0].id).toBe(expectedDevices[0].id);
        expect(actualDevices[0].isEmulator).toBe(expectedDevices[0].isEmulator);
        expect(actualDevices[0].friendlyName).toBe(rawFriendlyName1);
        expect(actualDevices[1].id).toBe(expectedDevices[1].id);
        expect(actualDevices[1].isEmulator).toBe(expectedDevices[1].isEmulator);
        expect(actualDevices[1].friendlyName).toBe(friendlyName2);

        verifyAllMocks();
    });

    it('setSelectedDevice changes value', async () => {
        // Note that we test this indirectly since can't read it
        const expectedDevice = 'another device';
        const expectedMessage = 'Error thrown during hasRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(expectedDevice, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        testSubject.setSelectedDevice(expectedDevice);

        await expect(testSubject.hasRequiredServiceVersion()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredServiceVersion()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns false if installed package has no versionName', async () => {
        const packageInfo: PackageInfo = {};
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

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
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

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
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during installRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installRequiredServiceVersion()).rejects.toThrowError(
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
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

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
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is same as Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it('installRequiredServiceVersion uninstalls then installs if installed version is newer than Apk version', async () => {
        let callbackCount: number = 0;
        let uninstallOrder: number = undefined;
        let installOrder: number = undefined;
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.4',
        };
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.uninstallService(testDeviceId, servicePackageName))
            .callback(() => {
                uninstallOrder = callbackCount++;
            })
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .callback(() => {
                installOrder = callbackCount++;
            })
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        expect(uninstallOrder).toBe(0);
        expect(installOrder).toBe(1);
        expect(callbackCount).toBe(2);

        verifyAllMocks();
    });

    it('hasRequiredPermissions propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredPermissions';
        adbWrapperMock
            .setup(m =>
                m.hasPermission(
                    testDeviceId,
                    accessibilityServiceName,
                    serviceIsRunningResponseSnippet,
                ),
            )
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredPermissions()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is not running', async () => {
        adbWrapperMock
            .setup(m =>
                m.hasPermission(
                    testDeviceId,
                    accessibilityServiceName,
                    serviceIsRunningResponseSnippet,
                ),
            )
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is running without screenshot permission', async () => {
        adbWrapperMock
            .setup(m =>
                m.hasPermission(
                    testDeviceId,
                    accessibilityServiceName,
                    serviceIsRunningResponseSnippet,
                ),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m =>
                m.hasPermission(testDeviceId, mediaProjectionServiceName, servicePackageName),
            )
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns true if service is running with screenshot permission', async () => {
        adbWrapperMock
            .setup(m =>
                m.hasPermission(
                    testDeviceId,
                    accessibilityServiceName,
                    serviceIsRunningResponseSnippet,
                ),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m =>
                m.hasPermission(testDeviceId, mediaProjectionServiceName, servicePackageName),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('fetchDeviceConfig fetches config from adb', async () => {
        const testConfigResponse = {
            deviceName: 'test-device',
            packageName: 'test-identifier',
        };

        const testConfig = {
            deviceName: 'test-device',
            appIdentifier: 'test-identifier',
        };

        adbWrapperMock
            .setup(m => m.readContent(testDeviceId, `content://${servicePackageName}/config`))
            .returns(() => Promise.resolve(JSON.stringify(testConfigResponse)))
            .verifiable(Times.once());
        const config = await testSubject.fetchDeviceConfig();
        expect(config).toEqual(testConfig);
        verifyAllMocks();
    });

    it('fetchDeviceConfig fetches propagates errors', async () => {
        const expectedError = 'error from ADB';

        adbWrapperMock
            .setup(m => m.readContent(testDeviceId, `content://${servicePackageName}/config`))
            .throws(new Error(expectedError))
            .verifiable(Times.once());
        await expect(testSubject.fetchDeviceConfig()).rejects.toThrowError(expectedError);
        verifyAllMocks();
    });

    it('grantOverlayPermission propagates thrown errors', async () => {
        // This test has the side effect of ensuring grantOverlayPermission is called
        // So there is no need for a separate test.

        const expectedMessage = 'Error thrown during grantOverlayPermission';

        adbWrapperMock
            .setup(m =>
                m.grantPermission(
                    testDeviceId,
                    servicePackageName,
                    'android.permission.SYSTEM_ALERT_WINDOW',
                ),
            )
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.grantOverlayPermission()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });
});
