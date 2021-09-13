// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import { KeyEventCode, PackageInfo } from 'electron/platform/android/adb-wrapper';
import { AppiumAdbWrapper } from 'electron/platform/android/appium-adb-wrapper';
import { ExpectedCallType, IMock, It, Mock, MockBehavior, Times } from 'typemoq';
describe('AppiumAdbWrapper tests', () => {
    let adbMock: IMock<ADB>;
    let testSubject: AppiumAdbWrapper;

    const emulatorId: string = 'id1';
    const emulatorModel: string = 'model1';
    const deviceId: string = 'id2';
    const deviceModel: string = 'model2';
    const testPackageName: string = 'my_service';
    const testDumpsysService = 'super_widget';
    const expectedPathToApk: string = './some/path/package.apk';
    const testConfig = {
        deviceName: 'my device',
        packageName: 'app.company.com',
        irrelevantOtherProperty: 'should not appear in output',
    };

    const testContentUri: string = `content://${testPackageName}`;

    beforeEach(() => {
        adbMock = Mock.ofType<ADB>(undefined, MockBehavior.Strict);
        testSubject = new AppiumAdbWrapper(adbMock.object);
    });

    it('getConnectedDevices, propagates error', async () => {
        const expectedMessage = 'Thrown during getConnectedDevices';
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
        const expectedMessage = 'Thrown during getPackageInfo';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getPackageInfo(emulatorId, testPackageName)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains neither versionName nor versionCode', async () => {
        const expectedPackageInfo: PackageInfo = {};
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(testPackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId, testPackageName);
        expect(info.versionCode).toBeUndefined();
        expect(info.versionName).toBeUndefined();

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains only versionName', async () => {
        const versionName: string = 'my version';
        const expectedPackageInfo: PackageInfo = { versionName };
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(testPackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId, testPackageName);
        expect(info.versionCode).toBeUndefined();
        expect(info.versionName).toBe(versionName);

        adbMock.verifyAll();
    });

    it('getPackageInfo, contains only versionCode', async () => {
        const versionCode: number = 12345;
        const expectedPackageInfo: PackageInfo = { versionCode };
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.getPackageInfo(testPackageName))
            .returns(() => expectedPackageInfo)
            .verifiable(Times.once());

        const info = await testSubject.getPackageInfo(emulatorId, testPackageName);
        expect(info.versionCode).toBe(versionCode);
        expect(info.versionName).toBeUndefined();

        adbMock.verifyAll();
    });

    it('getDumpsysOutput, propagates error', async () => {
        const expectedMessage = 'Thrown during getDumpsysOutput';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(
            testSubject.getDumpsysOutput(emulatorId, testDumpsysService),
        ).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
    });

    it('getDumpsysOutput, returns output', async () => {
        const expectedDumpsysOutput: String = 'Mary had a little lamb';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['dumpsys', testDumpsysService]))
            .returns(() => expectedDumpsysOutput)
            .verifiable(Times.once());

        const output = await testSubject.getDumpsysOutput(emulatorId, testDumpsysService);

        expect(output).toBe(expectedDumpsysOutput);

        adbMock.verifyAll();
    });

    it('installService, propagates error', async () => {
        const expectedMessage: string = 'Thrown during installService';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installService(emulatorId, testPackageName)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
    });

    it('installService, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.install(expectedPathToApk))
            .returns(() => '')
            .verifiable(Times.once());

        await testSubject.installService(emulatorId, expectedPathToApk);

        adbMock.verifyAll();
    });

    it('uninstallService, propagates error', async () => {
        const expectedMessage: string = 'Thrown during uninstallService';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(
            testSubject.uninstallService(emulatorId, testPackageName),
        ).rejects.toThrowError(expectedMessage);

        adbMock.verifyAll();
    });

    it('uninstallService, succeeds', async () => {
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.uninstallApk(testPackageName))
            .returns(() => '')
            .verifiable(Times.once());

        await testSubject.uninstallService(emulatorId, testPackageName);

        adbMock.verifyAll();
    });

    it('readContent, succeeds', async () => {
        const testContentType = 'config';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m =>
                m.shell(['content', 'read', '--uri', `${testContentUri}/${testContentType}`]),
            )
            .returns(() => testConfig.toString())
            .verifiable(Times.once());

        const config = await testSubject.readContent(
            emulatorId,
            `${testContentUri}/${testContentType}`,
        );

        expect(config).toBe(testConfig.toString());

        adbMock.verifyAll();
    });

    it('readContent, propagates error', async () => {
        const testContentType = 'config';
        const expectedErrorMsg: string = 'Thrown during readContent';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedErrorMsg))
            .verifiable(Times.once());

        await expect(
            testSubject.readContent(emulatorId, `${testPackageName}/${testContentType}`),
        ).rejects.toThrowError(expectedErrorMsg);

        adbMock.verifyAll();
    });

    it('callContent, succeeds', async () => {
        const testCommand = 'DO_SOMETHING';
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m =>
                m.shell(['content', 'call', '--uri', `${testContentUri}`, '--method', testCommand]),
            )
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        await testSubject.callContent(emulatorId, `${testContentUri}`, testCommand);

        adbMock.verifyAll();
    });

    it('callContent, propagates error', async () => {
        const testCommand = 'DO_SOMETHING';
        const expectedErrorMsg: string = 'Thrown during callContent';
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .throws(new Error(expectedErrorMsg))
            .verifiable(Times.once());

        await expect(
            testSubject.callContent(emulatorId, testContentUri, testCommand),
        ).rejects.toThrowError(expectedErrorMsg);

        adbMock.verifyAll();
    });

    it('sendKeyEvent, propagates error', async () => {
        const expectedMessage: string = 'Thrown during sendKeyEvent';
        const keyEventCode: KeyEventCode = KeyEventCode.Tab;

        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(['input', 'keyevent', keyEventCode]))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.sendKeyEvent(emulatorId, keyEventCode)).rejects.toThrowError(
            expectedMessage,
        );

        adbMock.verifyAll();
    });

    describe('sendKeyEvent, succeeds', () => {
        test.each([
            KeyEventCode.Up,
            KeyEventCode.Down,
            KeyEventCode.Left,
            KeyEventCode.Right,
            KeyEventCode.Enter,
            KeyEventCode.Tab,
        ])('sendKeyEvent sending %p', async (keyEventCode: KeyEventCode) => {
            adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
            adbMock
                .setup(m => m.shell(['input', 'keyevent', keyEventCode]))
                .verifiable(Times.once());

            await testSubject.sendKeyEvent(emulatorId, keyEventCode);

            adbMock.verifyAll();
        });
    });

    it('hasPermission, returns true if matchString is in dumpsys output', async () => {
        const checkPermissionCommand = `dumpsys my_permission`;
        const permissionIndicator = 'MY_PERMISSION="granted"';
        const permissionSuccessOutput = `hooray yes ${permissionIndicator}`;
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.exactly(1));
        adbMock
            .setup(m => m.shell(checkPermissionCommand.split(/\s+/)))
            .returns(() => Promise.resolve(permissionSuccessOutput))
            .verifiable(Times.once());

        const hasPermission = await testSubject.hasPermission(
            emulatorId,
            'my_permission',
            permissionIndicator,
        );
        expect(hasPermission).toEqual(true);
        adbMock.verifyAll();
    });

    it('hasPermission, returns false if matchString is not in dumpsys output', async () => {
        const checkPermissionCommand = `dumpsys my_permission`;
        const permissionIndicator = 'MY_PERMISSION="granted"';
        const permissionFailOutput = `indicator NOT present!`;
        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .verifiable(Times.exactly(1), ExpectedCallType.InSequence);
        adbMock
            .setup(m => m.shell(checkPermissionCommand.split(/\s+/)))
            .returns(() => Promise.resolve(permissionFailOutput))
            .verifiable(Times.once());

        const hasPermission = await testSubject.hasPermission(
            emulatorId,
            'my_permission',
            permissionIndicator,
        );
        expect(hasPermission).toEqual(false);
        adbMock.verifyAll();
    });

    it('hasPermission, propagates errors from dumpsys output', async () => {
        const permissionIndicator = 'MY_PERMISSION="granted"';
        const errorMessage = `error thrown in dumpsys!`;
        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.exactly(1));
        adbMock
            .setup(m => m.shell(['dumpsys', 'my_permission']))
            .throws(new Error(errorMessage))
            .verifiable(Times.once());

        await expect(
            testSubject.hasPermission(emulatorId, 'my_permission', permissionIndicator),
        ).rejects.toThrowError(errorMessage);
        adbMock.verifyAll();
    });

    it('grantPermission, calls expected adb commands', async () => {
        const resetCommand = `cmd appops reset ${testPackageName}`;
        const testPermission = 'android.permission.SYSTEM_ALERT_WINDOW';
        const grantCommand = `pm grant ${testPackageName} ${testPermission}`;

        adbMock
            .setup(m => m.setDeviceId(emulatorId))
            .verifiable(Times.once(), ExpectedCallType.InSequence);
        adbMock
            .setup(m => m.shell(resetCommand.split(/\s+/)))
            .verifiable(Times.once(), ExpectedCallType.InSequence);
        adbMock
            .setup(m => m.shell(grantCommand.split(/\s+/)))
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        await testSubject.grantPermission(emulatorId, testPackageName, testPermission);

        adbMock.verifyAll();
    });

    it('grantPermission, propagates error', async () => {
        const expectedMessage: string = 'Thrown during grantPermission';

        adbMock.setup(m => m.setDeviceId(emulatorId)).verifiable(Times.once());
        adbMock
            .setup(m => m.shell(It.isAny()))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(
            testSubject.grantPermission(emulatorId, testPackageName, 'testPermission'),
        ).rejects.toThrowError(expectedMessage);

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
