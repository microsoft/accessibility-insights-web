// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
} from 'electron/platform/android/android-service-apk-locator';
import {
    PackageInfo,
    PermissionInfo,
} from 'electron/platform/android/android-service-configurator';
import {
    AppiumServiceConfigurator,
    PortFinder,
} from 'electron/platform/android/appium-service-configurator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AppiumServiceConfigurator tests', () => {
    let adbMock: IMock<ADB>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let portFinderMock: IMock<PortFinder>;
    let testSubject: AppiumServiceConfigurator;

    const emulatorId: string = 'id1';
    const emulatorModel: string = 'model1';
    const deviceId: string = 'id2';
    const deviceModel: string = 'model2';
    const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';
    const dumpsysAccessibilitySnippetWithServiceRunning: string =
        'Service[label=Accessibility Insights for';
    const expectedPathToApk: string = './some/path/package.apk';
    const expectedServicePortNumber: number = 62442;
    const expectedHostPortRangeStart: number = 62442;
    const expectedHostPortRangeStop: number = 62542;

    beforeEach(() => {
        adbMock = Mock.ofType<ADB>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        portFinderMock = Mock.ofType<PortFinder>(undefined, MockBehavior.Strict);
        testSubject = new AppiumServiceConfigurator(
            adbMock.object,
            apkLocatorMock.object,
            portFinderMock.object,
        );
    });

    it('getConnectedDevices, propagates error', async () => {
        const expectedMessage = 'Thrown during getConnectedDevices';
        adbMock
            .setup(m => m.getConnectedEmulators())
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getConnectedDevices()).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
    });

    it('getPackageInfo, propagates error', async () => {
        const expectedMessage = 'Thrown during getPackageInfo';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getPackageInfo(emulatorId)).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
    });

    it('getPermissionInfo, propagates error', async () => {
        const expectedMessage = 'Thrown during getPermissionInfo';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getPermissionInfo(emulatorId)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
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
        apkLocatorMock.verifyAll();
    });

    it('installService, propagates error', async () => {
        const expectedMessage: string = 'Thrown during installService';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installService(emulatorId)).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
    });

    it('installService, succeeds', async () => {
        const apkInfo: AndroidServiceApkInfo = {
            path: expectedPathToApk,
        } as AndroidServiceApkInfo;
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.install(expectedPathToApk))
            .returns(() => '')
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(apkInfo))
            .verifiable(Times.once());

        await testSubject.installService(emulatorId);

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
    });

    it('uninstallService, propagates error', async () => {
        const expectedMessage: string = 'Thrown during uninstallService';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.uninstallService(emulatorId)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
    });

    it('uninstallService, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.uninstallApk(servicePackageName))
            .returns(() => '')
            .verifiable(Times.once());

        await testSubject.uninstallService(emulatorId);

        adbMock.verifyAll();
        apkLocatorMock.verifyAll();
    });

    describe('setupTcpForwarding', () => {
        it('propagates error from portFinder', async () => {
            const expectedMessage: string = 'Thrown from portFinder';
            portFinderMock
                .setup(m => m(It.isAny()))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(testSubject.setupTcpForwarding(emulatorId)).rejects.toThrowError(
                expectedMessage,
            );

            portFinderMock.verifyAll();
            adbMock.verifyAll();
            apkLocatorMock.verifyAll();
        });

        it('propagates error from ADB.forwardPort', async () => {
            const portFinderOutput = 63000;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());

            adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());

            const expectedMessage: string = 'Thrown during forwardPort';
            adbMock
                .setup(m => m.forwardPort(portFinderOutput, expectedServicePortNumber))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(testSubject.setupTcpForwarding(emulatorId)).rejects.toThrowError(
                expectedMessage,
            );

            portFinderMock.verifyAll();
            adbMock.verifyAll();
            apkLocatorMock.verifyAll();
        });

        it('invokes ADB.forwardPort using the port from portFinder', async () => {
            const portFinderOutput = 63000;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());

            adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
            adbMock
                .setup(m => m.forwardPort(portFinderOutput, expectedServicePortNumber))
                .verifiable(Times.once());

            const output = await testSubject.setupTcpForwarding(emulatorId);
            expect(output).toBe(portFinderOutput);

            portFinderMock.verifyAll();
            adbMock.verifyAll();
            apkLocatorMock.verifyAll();
        });
    });

    describe('removeTcpForwarding', () => {
        it('calls ADB.removePortForward using hostPort', async () => {
            const expectedHostPort = 123;

            adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
            adbMock
                .setup(m => m.removePortForward(expectedHostPort))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.removeTcpForwarding(emulatorId, expectedHostPort);

            adbMock.verifyAll();
            apkLocatorMock.verifyAll();
        });

        it('propagates error from removePortForward', async () => {
            const irrelevantHostPort = 123;
            const expectedMessage: string = 'Thrown during removeTcpForwarding';

            adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
            adbMock
                .setup(m => m.removePortForward(It.isAny()))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(
                testSubject.removeTcpForwarding(emulatorId, irrelevantHostPort),
            ).rejects.toThrowError(expectedMessage);

            adbMock.verifyAll();
            apkLocatorMock.verifyAll();
        });
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
