// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AdbWrapper, AdbWrapperFactory, DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { ServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let serviceConfigFactoryMock: IMock<ServiceConfiguratorFactory>;
    let serviceConfigMock: IMock<ServiceConfigurator>;
    let configStoreMock: IMock<UserConfigurationStore>;
    let configMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let fetchConfigMock: IMock<DeviceConfigFetcher>;
    let loggerMock: IMock<Logger>;
    let adbWrapperFactoryMock: IMock<AdbWrapperFactory>;
    let adbWrapperHolderMock: IMock<AdbWrapperHolder>;
    let adbWrapperStub: AdbWrapper;
    let testSubject: LiveAndroidSetupDeps;

    beforeEach(() => {
        serviceConfigFactoryMock = Mock.ofType<ServiceConfiguratorFactory>(
            undefined,
            MockBehavior.Strict,
        );
        serviceConfigMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        configStoreMock = Mock.ofType<UserConfigurationStore>(undefined, MockBehavior.Strict);
        configMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        fetchConfigMock = Mock.ofInstance((port: number) => new Promise<DeviceConfig>(() => null));
        loggerMock = Mock.ofType<Logger>();
        adbWrapperFactoryMock = Mock.ofType<AdbWrapperFactory>(undefined, MockBehavior.Strict);
        adbWrapperHolderMock = Mock.ofType<AdbWrapperHolder>(undefined, MockBehavior.Strict);
        adbWrapperStub = {} as AdbWrapper;

        testSubject = new LiveAndroidSetupDeps(
            serviceConfigFactoryMock.object,
            configStoreMock.object,
            configMessageCreatorMock.object,
            fetchConfigMock.object,
            loggerMock.object,
            adbWrapperFactoryMock.object,
            adbWrapperHolderMock.object,
        );
    });

    function verifyAllMocks(): void {
        serviceConfigFactoryMock.verifyAll();
        serviceConfigMock.verifyAll();
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
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfigurator(adbWrapperStub))
            .returns(() => serviceConfigMock.object)
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
        serviceConfigMock
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
        serviceConfigMock
            .setup(m => m.setSelectedDevice(expectedDeviceId))
            .verifiable(Times.once());
        await initializeServiceConfig();

        testSubject.setSelectedDeviceId(expectedDeviceId);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .throws(new Error('Threw during hasExpectedServiceVersion'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if service configurator returns false', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns true if service configurator returns true', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion())
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.installRequiredServiceVersion())
            .throws(new Error('Threw during installService'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('installService returns true on success', async () => {
        serviceConfigMock
            .setup(m => m.installRequiredServiceVersion())
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredPermissions())
            .throws(new Error('Threw during hasExpectedPermissions'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false if service configurator returns false', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredPermissions())
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns true if service configurator returns true', async () => {
        serviceConfigMock
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

        serviceConfigMock
            .setup(m => m.grantOverlayPermission())
            .throws(new Error('Threw during grantOverlayPermission'))
            .verifiable(Times.once());

        await initializeServiceConfig();

        await testSubject.grantOverlayPermission();

        verifyAllMocks();
    });

    it('setupTcpForwarding propagates error from serviceConfig.setupTcpForwarding', async () => {
        const serviceConfigErrorMessage = 'error from serviceConfig';
        serviceConfigMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.reject(new Error(serviceConfigErrorMessage)))
            .verifiable(Times.once());
        await initializeServiceConfig();

        await expect(testSubject.setupTcpForwarding()).rejects.toThrowError(
            serviceConfigErrorMessage,
        );

        verifyAllMocks();
    });

    it('setupTcpForwarding propagates output from serviceConfig.setupTcpForwarding', async () => {
        const serviceConfigOutput = 63000;
        serviceConfigMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(serviceConfigOutput))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const output = await testSubject.setupTcpForwarding();

        expect(output).toBe(serviceConfigOutput);

        verifyAllMocks();
    });

    it('removeTcpForwarding propagates error from serviceConfig.removeTcpForwarding', async () => {
        const port = 2;
        const serviceConfigErrorMessage = 'error from serviceConfig';
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(port))
            .returns(() => Promise.reject(new Error(serviceConfigErrorMessage)))
            .verifiable(Times.once());
        await initializeServiceConfig();

        await expect(testSubject.removeTcpForwarding(port)).rejects.toThrowError(
            serviceConfigErrorMessage,
        );

        verifyAllMocks();
    });

    it('removeTcpForwarding propagates to serviceConfig.removeTcpForwarding', async () => {
        const port = 63000;
        serviceConfigMock
            .setup(m => m.removeTcpForwarding(port))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        await initializeServiceConfig();

        await testSubject.removeTcpForwarding(port);

        verifyAllMocks();
    });
});
