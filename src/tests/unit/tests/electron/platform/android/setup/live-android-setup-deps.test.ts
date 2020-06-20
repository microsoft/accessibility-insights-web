// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Logger } from 'common/logging/logger';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { AndroidServiceSetupBusinessLogic } from 'electron/platform/android/setup/live-android-service-setup-business-logic';
import { AndroidServiceSetupBusinessLogicFactory } from 'electron/platform/android/setup/live-android-service-setup-business-logic-factory';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let businessLogicFactoryMock: IMock<AndroidServiceSetupBusinessLogicFactory>;
    let businessLogicMock: IMock<AndroidServiceSetupBusinessLogic>;
    let configStoreMock: IMock<UserConfigurationStore>;
    let configMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let fetchConfigMock: IMock<DeviceConfigFetcher>;
    let loggerMock: IMock<Logger>;
    let testSubject: LiveAndroidSetupDeps;

    beforeEach(() => {
        businessLogicFactoryMock = Mock.ofType<AndroidServiceSetupBusinessLogicFactory>(
            undefined,
            MockBehavior.Strict,
        );
        businessLogicMock = Mock.ofType<AndroidServiceSetupBusinessLogic>(
            undefined,
            MockBehavior.Strict,
        );
        configStoreMock = Mock.ofType<UserConfigurationStore>(undefined, MockBehavior.Strict);
        configMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        fetchConfigMock = Mock.ofInstance((port: number) => new Promise<DeviceConfig>(() => null));
        loggerMock = Mock.ofType<Logger>();
        testSubject = new LiveAndroidSetupDeps(
            businessLogicFactoryMock.object,
            configStoreMock.object,
            configMessageCreatorMock.object,
            fetchConfigMock.object,
            loggerMock.object,
        );
    });

    function verifyAllMocks(): void {
        businessLogicFactoryMock.verifyAll();
        businessLogicMock.verifyAll();
        configStoreMock.verifyAll();
        configMessageCreatorMock.verifyAll();
    }

    async function initializeBusinessLogic(): Promise<boolean> {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        businessLogicFactoryMock
            .setup(m => m.getBusinessLogic(expectedAdbLocation))
            .returns(() => Promise.resolve(businessLogicMock.object))
            .verifiable(Times.once());
        businessLogicMock.setup((m: any) => m.then).returns(() => undefined);
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
        const success: boolean = await initializeBusinessLogic();
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
        businessLogicMock
            .setup(m => m.getDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const actualDevices = await testSubject.getDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDeviceId persists correctly', async () => {
        // Note: We can only validate this indirectly. We set the expected ID,
        // then confirm that it gets passed to the business logic.
        const expectedDeviceId: string = 'abc-123';
        businessLogicMock
            .setup(m => m.hasRequiredServiceVersion(expectedDeviceId))
            .throws(new Error('Threw validating setSeletedDeviceId'))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        testSubject.setSelectedDeviceId(expectedDeviceId);

        await testSubject.hasExpectedServiceVersion();

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false on error', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .throws(new Error('Threw during hasExpectedServiceVersion'))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns false if business logic returns false', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedServiceVersion returns true if business logic returns true', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installService returns false on error', async () => {
        businessLogicMock
            .setup(m => m.installRequiredServiceVersion(undefined))
            .throws(new Error('Threw during installService'))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.installService();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('installService returns true on success', async () => {
        businessLogicMock
            .setup(m => m.installRequiredServiceVersion(undefined))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.installService();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false on error', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .throws(new Error('Threw during hasExpectedPermissions'))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns false if business logic returns false', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .returns(() => Promise.resolve(false))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasExpectedPermissions returns true if business logic returns true', async () => {
        businessLogicMock
            .setup(m => m.hasRequiredPermissions(undefined))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());
        await initializeBusinessLogic();

        const success = await testSubject.hasExpectedPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setTcpForwarding returns false on error', async () => {
        businessLogicMock
            .setup(m => m.setTcpForwarding(undefined))
            .throws(new Error('Threw during setTcpForwarding'))
            .verifiable(Times.once());
        await initializeBusinessLogic();

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
        businessLogicMock
            .setup(m => m.setTcpForwarding(undefined))
            .returns(() => Promise.resolve(testPort))
            .verifiable(Times.once());
        await initializeBusinessLogic();

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
