// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AdbWrapper, AdbWrapperFactory, DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { DeviceConfigurator } from 'electron/platform/android/setup/android-device-configurator';
import { DeviceConfiguratorFactory } from 'electron/platform/android/setup/android-device-configurator-factory';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let deviceConfigFactoryMock: IMock<DeviceConfiguratorFactory>;
    let deviceConfigMock: IMock<DeviceConfigurator>;
    let configStoreMock: IMock<UserConfigurationStore>;
    let configMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let loggerMock: IMock<Logger>;
    let adbWrapperFactoryMock: IMock<AdbWrapperFactory>;
    let adbWrapperHolderMock: IMock<AdbWrapperHolder>;
    let adbWrapperStub: AdbWrapper;
    let testSubject: LiveAndroidSetupDeps;

    beforeEach(() => {
        deviceConfigFactoryMock = Mock.ofType<DeviceConfiguratorFactory>(
            undefined,
            MockBehavior.Strict,
        );
        deviceConfigMock = Mock.ofType<DeviceConfigurator>(undefined, MockBehavior.Strict);
        configStoreMock = Mock.ofType<UserConfigurationStore>(undefined, MockBehavior.Strict);
        configMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        loggerMock = Mock.ofType<Logger>();
        adbWrapperFactoryMock = Mock.ofType<AdbWrapperFactory>(undefined, MockBehavior.Strict);
        adbWrapperHolderMock = Mock.ofType<AdbWrapperHolder>(undefined, MockBehavior.Strict);
        adbWrapperStub = {} as AdbWrapper;

        testSubject = new LiveAndroidSetupDeps(
            deviceConfigFactoryMock.object,
            configStoreMock.object,
            configMessageCreatorMock.object,
            loggerMock.object,
            adbWrapperFactoryMock.object,
            adbWrapperHolderMock.object,
        );
    });

    function verifyAllMocks(): void {
        deviceConfigFactoryMock.verifyAll();
        deviceConfigMock.verifyAll();
        configStoreMock.verifyAll();
        configMessageCreatorMock.verifyAll();
    }

    async function initializeServiceConfig(): Promise<boolean> {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        adbWrapperFactoryMock
            .setup(m => m.createValidatedAdbWrapper(expectedAdbLocation))
            .returns(() => Promise.resolve(adbWrapperStub));
        adbWrapperHolderMock.setup(m => m.setAdb(adbWrapperStub)).verifiable();
        deviceConfigFactoryMock
            .setup(m => m.getDeviceConfigurator(adbWrapperStub))
            .returns(() => deviceConfigMock.object)
            .verifiable(Times.once());
        return await testSubject.hasAdbPath();
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
        const success: boolean = await initializeServiceConfig();
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

    it('getDevices returns info from service configurator', async () => {
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
        deviceConfigMock
            .setup(m => m.getConnectedDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const actualDevices = await testSubject.getDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDeviceId chains to service configurator', async () => {
        const expectedDeviceId: string = 'abc-123';
        deviceConfigMock.setup(m => m.setSelectedDevice(expectedDeviceId)).verifiable(Times.once());
        await initializeServiceConfig();

        testSubject.setSelectedDeviceId(expectedDeviceId);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false on error', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .throws(new Error('Threw during hasExpectedServiceVersion'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if service configurator returns false', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns true if service configurator returns true', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService returns false on error', async () => {
        deviceConfigMock
            .setup(m => m.installRequiredServiceVersion())
            .throws(new Error('Threw during installService'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('installService returns true on success', async () => {
        deviceConfigMock
            .setup(m => m.installRequiredServiceVersion())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredPermissions())
            .throws(new Error('Threw during hasExpectedPermissions'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false if service configurator returns false', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredPermissions())
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns true if service configurator returns true', async () => {
        deviceConfigMock
            .setup(m => m.hasRequiredPermissions())
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('grantOverlayPermission catches thrown errors', async () => {
        // This test has the side effect of ensuring grantOverlayPermission is called
        // So there is no need for a separate test.

        deviceConfigMock
            .setup(m => m.grantOverlayPermission())
            .throws(new Error('Threw during grantOverlayPermission'))
            .verifiable(Times.once());

        await initializeServiceConfig();

        await testSubject.grantOverlayPermission();

        verifyAllMocks();
    });

    it('fetchDeviceConfig returns info from configurator', async () => {
        const testConfig: DeviceConfig = {
            deviceName: 'test-device',
            appIdentifier: 'test-identifier',
        };

        deviceConfigMock
            .setup(m => m.fetchDeviceConfig())
            .returns(() => Promise.resolve(testConfig))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const config = await testSubject.fetchDeviceConfig();
        expect(config).toEqual(testConfig);
        verifyAllMocks();
    });

    it('fetchDeviceConfig catches thrown errors', async () => {
        const expectedError = 'error thrown in configurator';
        await initializeServiceConfig();

        deviceConfigMock
            .setup(m => m.fetchDeviceConfig())
            .throws(new Error(expectedError))
            .verifiable(Times.once());

        await expect(testSubject.fetchDeviceConfig()).rejects.toThrow(expectedError);
        verifyAllMocks();
    });
});
