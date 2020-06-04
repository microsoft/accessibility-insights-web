// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AppiumServiceConfigurator } from 'electron/platform/android/appium-service-configurator';
import {
    AdbCreate,
    AppiumServiceConfiguratorFactory,
} from 'electron/platform/android/appium-service-configurator-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AppiumServiceConfiguratorFactory tests', () => {
    let adbCreateMock: IMock<AdbCreate>;

    beforeEach(() => {
        adbCreateMock = Mock.ofType<AdbCreate>(undefined, MockBehavior.Strict);
    });

    it('getServiceConfigurator creates without parameters if no sdkRoot is provided', async () => {
        adbCreateMock
            .setup(m => m.createADB(undefined))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumServiceConfiguratorFactory();

        expect(
            await factory.getServiceConfiguratorTestable(null, adbCreateMock.object),
        ).toBeInstanceOf(AppiumServiceConfigurator);

        adbCreateMock.verifyAll();
    });

    it('getServiceConfigurator creates with sdkRoot if it is provided', async () => {
        const expectedSdkRoot = 'path/to/android/sdk';
        adbCreateMock
            .setup(m => m.createADB({ sdkRoot: expectedSdkRoot }))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumServiceConfiguratorFactory();

        expect(
            await factory.getServiceConfiguratorTestable(expectedSdkRoot, adbCreateMock.object),
        ).toBeInstanceOf(AppiumServiceConfigurator);

        adbCreateMock.verifyAll();
    });
});
