// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import { AppiumServiceConfigurator } from 'electron/platform/android/appium-service-configurator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AppiumServiceConfigurator tests', () => {
    let adbMock: IMock<ADB>;
    let testSubject: AppiumServiceConfigurator;

    const emulatorId: string = 'id1';
    const emulatorModel: string = 'model1';
    const deviceId: string = 'id2';
    const deviceModel: string = 'model2';
    const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';
    const dumpsysAccessibilitySnippetWithServiceRunning: string =
        'Service[label=Accessibility Insights for';
    const pathToApk: string = './ServiceForAndroid/AccessibilityInsightsforAndroidService.apk';
    const expectedPortNumber: number = 62442;

    beforeEach(() => {
        adbMock = Mock.ofType<ADB>(undefined, MockBehavior.Strict);
        testSubject = new AppiumServiceConfigurator(adbMock.object);
    });

    it('getConnectedDevices, propagates error', async () => {
        const expectedMessage = 'No devices connected';
        adbMock
            .setup(m => m.getConnectedEmulators())
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getConnectedDevices()).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
    });

    it('getConnectedDevices, No devices detected', async () => {
        adbMock
            .setup(m => m.getConnectedEmulators())
            .returns(() => [])
            .verifiable(Times.once());
        adbMock
            .setup(m => m.getConnectedDevices())
            .returns(() => [])
            .verifiable(Times.once());

        const devices = await testSubject.getConnectedDevices();

        expect(devices.length).toBe(0);

        adbMock.verifyAll();
    });

    it('getConnectedDevices, 1 emulator detected', async () => {
        const expectedDevices = [{ udid: emulatorId }];
        adbMock
            .setup(m => m.getConnectedEmulators())
            .returns(() => expectedDevices)
            .verifiable(Times.once());
        adbMock
            .setup(m => m.getConnectedDevices())
            .returns(() => expectedDevices)
            .verifiable(Times.once());
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getModel())
            .returns(() => emulatorModel)
            .verifiable(Times.once());

        const devices = await testSubject.getConnectedDevices();

        expect(devices.length).toBe(1);
        expect(devices[0].id).toBe(emulatorId);
        expect(devices[0].isEmulator).toBe(true);
        expect(devices[0].friendlyName).toBe(emulatorModel);

        adbMock.verifyAll();
    });

    it('getConnectedDevices, 1 physical device detected', async () => {
        const expectedDevices = [{ udid: deviceId }];
        adbMock
            .setup(m => m.getConnectedEmulators())
            .returns(() => [])
            .verifiable(Times.once());
        adbMock
            .setup(m => m.getConnectedDevices())
            .returns(() => expectedDevices)
            .verifiable(Times.once());
        adbMock.setup(m => m.setDeviceId(deviceId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getModel())
            .returns(() => deviceModel)
            .verifiable(Times.once());

        const devices = await testSubject.getConnectedDevices();

        expect(devices.length).toBe(1);
        expect(devices[0].id).toBe(deviceId);
        expect(devices[0].isEmulator).toBe(false);
        expect(devices[0].friendlyName).toBe(deviceModel);

        adbMock.verifyAll();
    });

    it('getConnectedDevices, 1 emulator and 1 physical device detected', async () => {
        const expectedEmulators = [{ udid: emulatorId }];
        const expectedDevices = [{ udid: deviceId }, { udid: emulatorId }];
        const expectedModels: Array<string> = [emulatorModel, deviceModel];
        let modelIndex = 0;
        adbMock
            .setup(m => m.getConnectedEmulators())
            .returns(() => expectedEmulators)
            .verifiable(Times.once());
        adbMock
            .setup(m => m.getConnectedDevices())
            .returns(() => expectedDevices)
            .verifiable(Times.once());
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock.setup(m => m.setDeviceId(deviceId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getModel())
            .returns(() => expectedModels[modelIndex++])
            .verifiable(Times.exactly(2));

        const devices = await testSubject.getConnectedDevices();

        expect(devices.length).toBe(2);
        expect(devices[0].id).toBe(emulatorId);
        expect(devices[0].isEmulator).toBe(true);
        expect(devices[0].friendlyName).toBe(emulatorModel);
        expect(devices[1].id).toBe(deviceId);
        expect(devices[1].isEmulator).toBe(false);
        expect(devices[1].friendlyName).toBe(deviceModel);

        adbMock.verifyAll();
    });

    it('getPackageInfo, propagates error', async () => {
        const expectedMessage = 'Package not found';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getPackageInfo(emulatorId)).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains neither versionName nor versionCode', async () => {
        const expectedPackageInfo: PackageInfo = {};
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(servicePackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId);
        expect(info.versionCode).toBeUndefined();
        expect(info.versionName).toBeUndefined();

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains only versionName', async () => {
        const versionName: string = 'my version';
        const expectedPackageInfo: PackageInfo = { versionName };
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(servicePackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId);
        expect(info.versionCode).toBeUndefined();
        expect(info.versionName).toBe(versionName);

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains only versionCode', async () => {
        const versionCode: number = 12345;
        const expectedPackageInfo: PackageInfo = { versionCode };
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(servicePackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId);
        expect(info.versionCode).toBe(versionCode);
        expect(info.versionName).toBeUndefined();

        adbMock.verifyAll();
    });

    it('getPermissionInfo, propagates error', async () => {
        const expectedMessage = 'Something bad happened';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'accessibility']))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getPermissionInfo(emulatorId)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
    });

    it('getPermissionInfo, service is not running', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'accessibility']))
            .returns(() => '')
            .verifiable(Times.once());

        await expect(testSubject.getPermissionInfo(emulatorId)).rejects.toThrowError(
            'Accessibility Insights for Android Service is not running',
        );

        adbMock.verifyAll();
    });

    it('getPermissionInfo, service is running without screenshot permission', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'accessibility']))
            .returns(() => dumpsysAccessibilitySnippetWithServiceRunning)
            .verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'media_projection']))
            .returns(() => '')
            .verifiable(Times.once());

        const permissionInfo: PermissionInfo = await testSubject.getPermissionInfo(emulatorId);

        expect(permissionInfo.screenshotGranted).toBe(false);

        adbMock.verifyAll();
    });

    it('getPermissionInfo, service is running with screenshot permission', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'accessibility']))
            .returns(() => dumpsysAccessibilitySnippetWithServiceRunning)
            .verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', 'media_projection']))
            .returns(
                () =>
                    // This is just a snippet, not the full string
                    '(com.microsoft.accessibilityinsightsforandroidservice, uid=10134): TYPE_SCREEN_CAPTURE',
            )
            .verifiable(Times.once());

        const permissionInfo: PermissionInfo = await testSubject.getPermissionInfo(emulatorId);

        expect(permissionInfo.screenshotGranted).toBe(true);

        adbMock.verifyAll();
    });

    it('installService, propagates error', async () => {
        const expectedError: string = 'Oops';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.install(pathToApk))
            .throws(new Error(expectedError))
            .verifiable(Times.once());

        await expect(testSubject.installService(emulatorId)).rejects.toThrowError(expectedError);

        adbMock.verifyAll();
    });

    it('installService, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.install(pathToApk))
            .returns(() => '')
            .verifiable(Times.once());

        await testSubject.installService(emulatorId);

        adbMock.verifyAll();
    });

    it('uninstallService, propagates error', async () => {
        const expectedError: string = 'Oops';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.uninstallApk(servicePackageName))
            .throws(new Error(expectedError))
            .verifiable(Times.once());

        await expect(testSubject.uninstallService(emulatorId)).rejects.toThrowError(expectedError);

        adbMock.verifyAll();
    });

    it('uninstallService, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.uninstallApk(servicePackageName))
            .returns(() => '')
            .verifiable(Times.once());

        await testSubject.uninstallService(emulatorId);

        adbMock.verifyAll();
    });

    it('setTcpForwarding, propagates error', async () => {
        const expectedError: string = 'Oops';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedError))
            .verifiable(Times.once());

        await expect(testSubject.setTcpForwarding(emulatorId)).rejects.toThrowError(expectedError);

        adbMock.verifyAll();
    });

    it('setTcpForwarding, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.forwardPort(expectedPortNumber, expectedPortNumber))
            .verifiable(Times.once());

        await testSubject.setTcpForwarding(emulatorId);

        adbMock.verifyAll();
    });

    it('removeTcpForwarding, propagates error', async () => {
        const expectedError: string = 'Oops';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedError))
            .verifiable(Times.once());

        await expect(testSubject.removeTcpForwarding(emulatorId)).rejects.toThrowError(
            expectedError,
        );

        adbMock.verifyAll();
    });

    it('removeTcpForwarding, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock.setup(m => m.removePortForward(expectedPortNumber)).verifiable(Times.once());

        await testSubject.removeTcpForwarding(emulatorId);

        adbMock.verifyAll();
    });
    /*
    // For live testing, set ANDROID_HOME or ANDROID_SDK_ROOT to point
    // to your local installation, then add this line just before
    // calling the testSubject:
    //
    // await setLiveTestSubject();
    //
    // You'll also need to change the device ID to match your actual device
    async function setLiveTestSubject(): Promise<void> {
        const adb: ADB = await ADB.createADB();
        testSubject = new AppiumServiceConfigurator(adb);
        adbMock = Mock.ofType<ADB>(undefined, MockBehavior.Strict);
    }
    */
});
