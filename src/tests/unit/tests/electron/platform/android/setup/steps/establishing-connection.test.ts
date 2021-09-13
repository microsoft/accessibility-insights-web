// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { establishingConnection } from 'electron/platform/android/setup/steps/establishing-connection';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: establishingConnection', () => {
    let mockStoreState: {
        appName?: string;
    };

    let depsMock: IMock<AndroidSetupDeps>;
    let storeCallbacksMock: IMock<AndroidSetupStoreCallbacks>;
    let stepTransitionMock: IMock<AndroidSetupStepTransitionCallback>;

    beforeEach(() => {
        depsMock = Mock.ofType<AndroidSetupDeps>(undefined, MockBehavior.Strict);
        storeCallbacksMock = Mock.ofType<AndroidSetupStoreCallbacks>(
            undefined,
            MockBehavior.Strict,
        );
        stepTransitionMock = Mock.ofInstance((_: AndroidSetupStepId) => {});

        depsMock
            .setup(m => m.logger)
            .returns(() => ({
                log: () => {},
                error: () => {},
            }))
            // We don't care how many times this is invoked
            .verifiable(Times.atLeast(0));

        storeCallbacksMock
            .setup(m => m.setApplicationName(It.isAny()))
            .callback(newName => {
                mockStoreState.appName = newName;
            })
            // We don't care how many times this is invoked, we only care about the final mockStoreState
            .verifiable(Times.atLeast(0));
    });

    afterEach(() => {
        depsMock.verifyAll();
        storeCallbacksMock.verifyAll();
        stepTransitionMock.verifyAll();
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupDeps;
        const step = establishingConnection(null, deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing with state set on success', async () => {
        const deviceConfig = { appIdentifier: 'new app' } as DeviceConfig;
        mockStoreState = {
            appName: null,
        };

        depsMock
            .setup(m => m.fetchDeviceConfig())
            .returns(_ => Promise.resolve(deviceConfig))
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-connected-start-testing'));

        const step = establishingConnection(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();

        expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
    });

    it.each`
        caseName                    | startingAppName
        ${'without previous state'} | ${null}
        ${'with previous state'}    | ${'old app'}
    `(
        'onEnter fetches device config, then transitions to prompt-connected-start-testing with state set on success',
        async ({ startingAppName }) => {
            const deviceConfig = { appIdentifier: 'new app' } as DeviceConfig;
            mockStoreState = {
                appName: startingAppName,
            };

            depsMock
                .setup(m => m.fetchDeviceConfig())
                .returns(_ => Promise.resolve(deviceConfig))
                .verifiable(Times.once());

            stepTransitionMock.setup(m => m('prompt-connected-start-testing'));

            const step = establishingConnection(
                stepTransitionMock.object,
                depsMock.object,
                storeCallbacksMock.object,
            );
            await step.onEnter();

            expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
        },
    );

    it.each`
        caseName                    | startingAppName
        ${'without previous state'} | ${null}
        ${'with previous state'}    | ${'old app'}
    `(
        'onEnter ($caseName) transitions to prompt-establishing-connection-failed with null state on getApplicationName failure',
        async ({ startingAppName }) => {
            mockStoreState = {
                appName: startingAppName,
            };

            depsMock
                .setup(m => m.fetchDeviceConfig())
                .returns(() => Promise.reject(new Error('error from getApplicationName')))
                .verifiable(Times.once());

            stepTransitionMock
                .setup(m => m('prompt-establishing-connection-failed'))
                .verifiable(Times.once());

            const step = establishingConnection(
                stepTransitionMock.object,
                depsMock.object,
                storeCallbacksMock.object,
            );
            await step.onEnter();

            expect(mockStoreState.appName).toBeNull(); // not 2
        },
    );
});
