// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';
import { DeviceConfig } from 'electron/platform/android/device-config';

describe('Android setup step: configuringPortForwarding', () => {
    let mockStoreState: {
        appName?: string;
        scanPort?: number;
    };

    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = configuringPortForwarding(deps);
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

        const depsMock = makeMockDepsForMockStore();

        depsMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(scanPort))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.fetchDeviceConfig(scanPort))
            .returns(_ => Promise.resolve(deviceConfig))
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-connected-start-testing'));

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
        expect(mockStoreState.scanPort).toBe(scanPort);
        depsMock.verifyAll();
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
            const depsMock = makeMockDepsForMockStore();

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

            depsMock.setup(m => m.stepTransition('prompt-connected-start-testing'));

            const step = configuringPortForwarding(depsMock.object);
            await step.onEnter();

            expect(mockStoreState.appName).toBe(deviceConfig.appIdentifier);
            expect(mockStoreState.scanPort).toBe(newScanPort);
            depsMock.verifyAll();
        },
    );

    it('onEnter (with previous state) transitions to prompt-configuring-port-forwarding-failed with old state on removeTcpForwarding failure', async () => {
        const startingAppName = 'old app';
        const startingScanPort = 1;
        mockStoreState = {
            appName: 'old app',
            scanPort: startingScanPort,
        };
        const depsMock = makeMockDepsForMockStore();

        depsMock
            .setup(m => m.removeTcpForwarding(startingScanPort))
            .returns(() => Promise.reject(new Error('error from removeTcpForwarding')))
            .verifiable(Times.once());

        depsMock.setup(m => m.setupTcpForwarding()).verifiable(Times.never());

        depsMock
            .setup(m => m.stepTransition('prompt-configuring-port-forwarding-failed'))
            .verifiable(Times.once());

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        expect(mockStoreState.appName).toBe(startingAppName);
        expect(mockStoreState.scanPort).toBe(startingScanPort);
        depsMock.verifyAll();
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
            const depsMock = makeMockDepsForMockStore();

            depsMock
                .setup(m => m.removeTcpForwarding(startingScanPort))
                .returns(() => Promise.resolve())
                .verifiable(startingScanPort === null ? Times.never() : Times.once());

            depsMock
                .setup(m => m.setupTcpForwarding())
                .returns(() => Promise.reject(new Error('test error')))
                .verifiable(Times.once());

            depsMock
                .setup(m => m.stepTransition('prompt-configuring-port-forwarding-failed'))
                .verifiable(Times.once());

            const step = configuringPortForwarding(depsMock.object);
            await step.onEnter();

            expect(mockStoreState.appName).toBeNull();
            expect(mockStoreState.scanPort).toBeNull();
            depsMock.verifyAll();
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
            const depsMock = makeMockDepsForMockStore();

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

            depsMock
                .setup(m => m.stepTransition('prompt-configuring-port-forwarding-failed'))
                .verifiable(Times.once());

            const step = configuringPortForwarding(depsMock.object);
            await step.onEnter();

            expect(mockStoreState.appName).toBeNull(); // not 2
            expect(mockStoreState.scanPort).toBeNull();
            depsMock.verifyAll();
        },
    );

    function makeMockDepsForMockStore(): IMock<AndroidSetupStepConfigDeps> {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);

        depsMock
            .setup(m => m.logger)
            .returns(() => ({
                log: () => {},
                error: () => {},
            }))
            // We don't care how many times this is invoked
            .verifiable(Times.atLeast(0));

        depsMock
            .setup(m => m.setScanPort(It.isAny()))
            .callback(newPort => {
                mockStoreState.scanPort = newPort;
            })
            // We don't care how many times this is invoked, we only care about the final mockStoreState
            .verifiable(Times.atLeast(0));

        depsMock
            .setup(m => m.getScanPort())
            .returns(() => mockStoreState.scanPort)
            .verifiable(Times.atLeast(0));

        depsMock
            .setup(m => m.setApplicationName(It.isAny()))
            .callback(newName => {
                mockStoreState.appName = newName;
            })
            // We don't care how many times this is invoked, we only care about the final mockStoreState
            .verifiable(Times.atLeast(0));

        return depsMock;
    }
});
