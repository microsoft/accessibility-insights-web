// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AppiumServiceConfiguratorFactory } from 'electron/platform/android/appium-service-configurator-factory';

describe('AppiumServiceConfiguratorFactory tests', () => {
    const nonExistentPath = './This/Path/Does/Not/Exist';
    const ANDROID_HOME = 'ANDROID_HOME';
    const ANDROID_SDK_ROOT = 'ANDROID_SDK_ROOT';
    const errorsFromAdb = 3;

    it('getServiceConfigurator uses default if no path is provided', async () => {
        if (canTestBeRun()) {
            const factory = new AppiumServiceConfiguratorFactory();
            expect.assertions(errorsFromAdb);
            try {
                await factory.getServiceConfigurator(null);
            } catch (e) {
                const error = e as Error;
                expect(error.message.includes(nonExistentPath)).toBeFalsy();
                expect(error.message.includes(ANDROID_HOME)).toBeTruthy();
                expect(error.message.includes(ANDROID_SDK_ROOT)).toBeTruthy();
            }
        }
    });

    it('getServiceConfigurator uses path if it is provided', async () => {
        if (canTestBeRun()) {
            const factory = new AppiumServiceConfiguratorFactory();
            expect.assertions(errorsFromAdb);
            try {
                await factory.getServiceConfigurator(nonExistentPath);
            } catch (e) {
                const error = e as Error;
                expect(error.message.includes(nonExistentPath)).toBeTruthy();
                expect(error.message.includes(ANDROID_HOME)).toBeFalsy();
                expect(error.message.includes(ANDROID_SDK_ROOT)).toBeFalsy();
            }
        }
    });

    // Appium-adb's built-in behavior is to use the environment variables if
    // they're set, and without a good way to override them, we just skip the tests.
    function canTestBeRun(): boolean {
        return (
            !isEnvironmentVariableSet(ANDROID_HOME) && !isEnvironmentVariableSet(ANDROID_SDK_ROOT)
        );
    }

    function isEnvironmentVariableSet(name: string): boolean {
        const value = process.env[name];
        return value && value.length > 0;
    }
});
