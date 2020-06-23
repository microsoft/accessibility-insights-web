// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { AndroidServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { AndroidServiceConfiguratorFactory } from 'electron/platform/android/setup/android-service-configurator-factory';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let serviceConfigFactoryMock: IMock<AndroidServiceConfiguratorFactory>;
    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let configStoreMock: IMock<UserConfigurationStore>;
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
        configMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        fetchConfigMock = Mock.ofInstance((port: number) => new Promise<DeviceConfig>(() => null));
        loggerMock = Mock.ofType<Logger>();
        testSubject = new LiveAndroidSetupDeps(
            serviceConfigFactoryMock.object,
            configStoreMock.object,
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
    }

    async function initializeServiceConfig(): Promise<boolean> {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfig(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());
        serviceConfigMock.setup((m: any) => m.then).returns(() => undefined);
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

    it('getDevices returns info from business logic', async () => {
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
            .setup(m => m.getDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const actualDevices = await testSubject.getDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDeviceId persists correctly', async () => {
        // Note: We can only validate this indirectly. We set the expected ID,
        // then confirm that it gets passed to the business logic.
        const expectedDeviceId: string = 'abc-123';
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion(expectedDeviceId))
            .throws(new Error('Threw validating setSeletedDeviceId'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        testSubject.setSelectedDeviceId(expectedDeviceId);

        await testSubject.hasExpectedServiceVersion();

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .throws(new Error('Threw during hasExpectedServiceVersion'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if business logic returns false', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns true if business logic returns true', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.installRequiredServiceVersion(undefined))
            .throws(new Error('Threw during installService'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('installService returns true on success', async () => {
        serviceConfigMock
            .setup(m => m.installRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .throws(new Error('Threw during hasExpectedPermissions'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false if business logic returns false', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns true if business logic returns true', async () => {
        serviceConfigMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setTcpForwarding returns false on error', async () => {
        serviceConfigMock
            .setup(m => m.setTcpForwarding(undefined))
            .throws(new Error('Threw during setTcpForwarding'))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.setTcpForwarding();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('getApplicationName returns app name when successful', async () => {
        const config: DeviceConfig = {
            appIdentifier: 'Wonderful App',
        } as DeviceConfig;

        const p = new Promise<DeviceConfig>(resolve => resolve(config));

        fetchConfigMock
            .setup(m => m(62442))
            .returns(() => p)
            .verifiable();

        const appName = await testSubject.getApplicationName();

        expect(appName).toEqual(config.appIdentifier);

        verifyAllMocks();
    });

    it('setTcpForwarding returns true if no error', async () => {
        const testPort = 12345;
        serviceConfigMock
            .setup(m => m.setTcpForwarding(undefined))
            .returns(() => Promise.resolve(testPort))
            .verifiable(Times.once());
        await initializeServiceConfig();

        const success = await testSubject.setTcpForwarding();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('getApplicationName returns empty string on error', async () => {
        fetchConfigMock
            .setup(m => m(62442))
            .throws(Error('some error'))
            .verifiable();

        const appName = await testSubject.getApplicationName();

        expect(appName).toEqual('');

        verifyAllMocks();
    });
});
