// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: configuringPortForwarding', () => {
    let mockStoreState: {
        appName?: string;
        scanPort?: number;
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
            .setup(m => m.setScanPort(It.isAny()))
            .callback(newPort => {
                mockStoreState.scanPort = newPort;
            })
            // We don't care how many times this is invoked, we only care about the final mockStoreState
            .verifiable(Times.atLeast(0));

        storeCallbacksMock
            .setup(m => m.getScanPort())
            .returns(() => mockStoreState.scanPort)
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
        const step = configuringPortForwarding(null, deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing with state set on success', async () => {
        const scanPort = 2;
        const deviceConfig = { appIdentifier: 'new app' } as DeviceConfig;
        mockStoreState = {
            appName: null,
            scanPort: null,
        };

        depsMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(scanPort))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.fetchDeviceConfig(scanPort))
            .returns(_ => Promise.resolve(deviceConfig))
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-connected-start-testing'));

        const step = configuringPortForwarding(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();

        expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
        expect(mockStoreState.scanPort).toBe(scanPort);
    });

    it.each`
        caseName                    | startingAppName | startingScanPort
        ${'without previous state'} | ${null}         | ${null}
        ${'with previous state'}    | ${'old app'}    | ${1}
    `(
        'onEnter clears previous forwarding, then transitions to prompt-connected-start-testing with state set on success',
        async ({ startingAppName, startingScanPort }) => {
            const newScanPort = 2;
            const deviceConfig = { appIdentifier: 'new app' } as DeviceConfig;
            mockStoreState = {
                appName: startingAppName,
                scanPort: startingScanPort,
            };

            depsMock
                .setup(m => m.removeTcpForwarding(startingScanPort))
                .returns(() => Promise.resolve())
                .verifiable(startingScanPort === null ? Times.never() : Times.once());

            depsMock
                .setup(m => m.setupTcpForwarding())
                .returns(() => Promise.resolve(newScanPort))
                .verifiable(Times.once());

            depsMock
                .setup(m => m.fetchDeviceConfig(newScanPort))
                .returns(_ => Promise.resolve(deviceConfig))
                .verifiable(Times.once());

            stepTransitionMock.setup(m => m('prompt-connected-start-testing'));

            const step = configuringPortForwarding(
                stepTransitionMock.object,
                depsMock.object,
                storeCallbacksMock.object,
            );
            await step.onEnter();

            expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
            expect(mockStoreState.scanPort).toBe(newScanPort);
        },
    );

    it('onEnter (with previous state) ignores errors from removeTcpForwarding', async () => {
        const startingScanPort = 1;
        const newScanPort = 2;
        const deviceConfig = { appIdentifier: 'new app' } as DeviceConfig;
        mockStoreState = {
            appName: 'old app',
            scanPort: startingScanPort,
        };

        depsMock
            .setup(m => m.removeTcpForwarding(startingScanPort))
            .returns(() => Promise.reject(new Error('error from removeTcpForwarding')))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(newScanPort))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.fetchDeviceConfig(newScanPort))
            .returns(_ => Promise.resolve(deviceConfig))
            .verifiable(Times.once());

        const step = configuringPortForwarding(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();

        expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
        expect(mockStoreState.scanPort).toBe(newScanPort);
    });

    it.each`
        caseName                    | startingAppName | startingScanPort
        ${'without previous state'} | ${null}         | ${null}
        ${'with previous state'}    | ${'old app'}    | ${1}
    `(
        'onEnter ($caseName) transitions to prompt-configuring-port-forwarding-failed with null state on setupTcpForwarding failure',
        async ({ startingAppName, startingScanPort }) => {
            mockStoreState = {
                appName: startingAppName,
                scanPort: startingScanPort,
            };

            depsMock
                .setup(m => m.removeTcpForwarding(startingScanPort))
                .returns(() => Promise.resolve())
                .verifiable(startingScanPort === null ? Times.never() : Times.once());

            depsMock
                .setup(m => m.setupTcpForwarding())
                .returns(() => Promise.reject(new Error('test error')))
                .verifiable(Times.once());

            stepTransitionMock
                .setup(m => m('prompt-configuring-port-forwarding-failed'))
                .verifiable(Times.once());

            const step = configuringPortForwarding(
                stepTransitionMock.object,
                depsMock.object,
                storeCallbacksMock.object,
            );
            await step.onEnter();

            expect(mockStoreState.appName).toBeNull();
            expect(mockStoreState.scanPort).toBeNull();
        },
    );

    it.each`
        caseName                    | startingAppName | startingScanPort
        ${'without previous state'} | ${null}         | ${null}
        ${'with previous state'}    | ${'old app'}    | ${1}
    `(
        'onEnter ($caseName) transitions to prompt-configuring-port-forwarding-failed with null state on getApplicationName failure',
        async ({ startingAppName, startingScanPort }) => {
            mockStoreState = {
                appName: startingAppName,
                scanPort: startingScanPort,
            };

            depsMock
                .setup(m => m.removeTcpForwarding(startingScanPort))
                .returns(() => Promise.resolve())
                .verifiable(startingScanPort === null ? Times.never() : Times.once());

            depsMock
                .setup(m => m.setupTcpForwarding())
                .returns(() => Promise.resolve(2))
                .verifiable(Times.once());

            depsMock
                .setup(m => m.fetchDeviceConfig(It.isAny()))
                .returns(() => Promise.reject(new Error('error from getApplicationName')))
                .verifiable(Times.once());

            stepTransitionMock
                .setup(m => m('prompt-configuring-port-forwarding-failed'))
                .verifiable(Times.once());

            const step = configuringPortForwarding(
                stepTransitionMock.object,
                depsMock.object,
                storeCallbacksMock.object,
            );
            await step.onEnter();

            expect(mockStoreState.appName).toBeNull(); // not 2
            expect(mockStoreState.scanPort).toBeNull();
        },
    );
});
