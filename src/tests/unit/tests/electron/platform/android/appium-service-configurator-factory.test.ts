// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AppiumServiceConfiguratorFactory } from 'electron/platform/android/appium-service-configurator-factory';

describe('AppiumServiceConfiguratorFactory tests', () => {
    const nonExistentPath = './This/Path/Does/Not/Exist';
    const ANDROID_HOME = 'ANDROID_HOME';
    const ANDROID_SDK_ROOT = 'ANDROID_SDK_ROOT';

    it('getServiceConfigurator uses default if no path is provided', async () => {
        if (isEnvironmentVariableSet(ANDROID_HOME) || isEnvironmentVariableSet(ANDROID_SDK_ROOT)) {
            // Skip this test since it may alter the system state
        } else {
            const factory = new AppiumServiceConfiguratorFactory();
            try {
                await factory.getServiceConfigurator(null);
                expect('this code should never execute').toBeFalsy();
            } catch (e) {
                const error = e as Error;
                expect(error.message.includes(nonExistentPath)).toBeFalsy();
                expect(error.message.includes(ANDROID_HOME)).toBeTruthy();
                expect(error.message.includes(ANDROID_SDK_ROOT)).toBeTruthy();
            }
        }
    });

    it('getServiceConfigurator uses path if it is provided', async () => {
        const factory = new AppiumServiceConfiguratorFactory();
        try {
            await factory.getServiceConfigurator(nonExistentPath);
            expect('this code should never execute').toBeFalsy();
        } catch (e) {
            const error = e as Error;
            expect(error.message.includes(nonExistentPath)).toBeTruthy();
            expect(error.message.includes(ANDROID_HOME)).toBeFalsy();
            expect(error.message.includes(ANDROID_SDK_ROOT)).toBeFalsy();
        }
    });

    function isEnvironmentVariableSet(name: string): boolean {
        const value = process.env[name];

        return value && value.length > 0;
    }
});
