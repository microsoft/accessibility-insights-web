// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    AndroidServiceConfigurator,
    AndroidServiceConfiguratorFactory,
} from 'electron/platform/android/android-service-configurator';
import { LiveAndroidSetupDeps } from 'electron/platform/android/setup/live-android-setup-deps';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('LiveAndroidSetupDeps', () => {
    const expectedAdbLocation = 'Expected ADB location';

    let serviceConfigFactoryMock: IMock<AndroidServiceConfiguratorFactory>;
    let serviceConfigMock: IMock<AndroidServiceConfigurator>;
    let configStoreMock: IMock<UserConfigurationStore>;
    let testSubject: LiveAndroidSetupDeps;

    beforeEach(() => {
        serviceConfigFactoryMock = Mock.ofType<AndroidServiceConfiguratorFactory>(
            undefined,
            MockBehavior.Strict,
        );
        serviceConfigMock = Mock.ofType<AndroidServiceConfigurator>(undefined, MockBehavior.Strict);
        configStoreMock = Mock.ofType<UserConfigurationStore>(undefined, MockBehavior.Strict);
        testSubject = new LiveAndroidSetupDeps(
            serviceConfigFactoryMock.object,
            configStoreMock.object,
        );
    });

    function verifyAllMocks(): void {
        serviceConfigFactoryMock.verifyAll();
        serviceConfigMock.verifyAll();
        configStoreMock.verifyAll();
    }

    it('hasAdbPath returns false on error', async () => {
        configStoreMock
            .setup(m => m.getState())
            .throws(new Error('test exception'))
            .verifiable(Times.once());

        const success: boolean = await testSubject.hasAdbPath();
        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasAdbPath chains and returns true on success', async () => {
        const stateData = { adbLocation: expectedAdbLocation } as UserConfigurationStoreData;

        serviceConfigMock.setup((m: any) => m.then).returns(() => undefined);
        configStoreMock
            .setup(m => m.getState())
            .returns(() => stateData)
            .verifiable(Times.once());
        serviceConfigFactoryMock
            .setup(m => m.getServiceConfigurator(expectedAdbLocation))
            .returns(() => Promise.resolve(serviceConfigMock.object))
            .verifiable(Times.once());

        const success: boolean = await testSubject.hasAdbPath();
        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('setAdbPath chains to UserConfigurationStore', () => {
        const mockStoreData = {} as UserConfigurationStoreData;

        configStoreMock
            .setup(m => m.getState())
            .returns(() => mockStoreData)
            .verifiable(Times.once());

        testSubject.setAdbPath(expectedAdbLocation);

        expect(mockStoreData.adbLocation).toBe(expectedAdbLocation);

        verifyAllMocks();
    });
});
