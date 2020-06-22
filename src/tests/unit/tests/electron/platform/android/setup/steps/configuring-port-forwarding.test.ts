// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: configuringPortForwarding', () => {
    let mockStoreState: {
        appName?: string;
        scanPort?: number;
    };

    beforeEach(() => {
        mockStoreState = {
            appName: null,
            scanPort: null,
        };
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = configuringPortForwarding(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing with state set on success', async () => {
        const scanPort = 63000;
        const appName = 'my app name';

        const depsMock = makeMockDepsForMockStore();

        depsMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(scanPort))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.getApplicationName())
            .returns(_ => Promise.resolve(appName))
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-connected-start-testing'));

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        expect(mockStoreState.appName).toBe(appName);
        expect(mockStoreState.scanPort).toBe(scanPort);
        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-configuring-port-forwarding-failed with null state on setupTcpForwarding failure', async () => {
        mockStoreState = {
            appName: 'old name which should get cleared on failure',
            scanPort: 1,
        };
        const depsMock = makeMockDepsForMockStore();

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
    });

    it('onEnter transitions to prompt-configuring-port-forwarding-failed with null state on getApplicationName failure', async () => {
        mockStoreState = {
            appName: 'old name which should get cleared on failure',
            scanPort: 1,
        };
        const depsMock = makeMockDepsForMockStore();

        depsMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(2))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.getApplicationName())
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
    });

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
            .verifiable(Times.atLeastOnce());

        depsMock
            .setup(m => m.setApplicationName(It.isAny()))
            .callback(newName => {
                mockStoreState.appName = newName;
            })
            // We don't care how many times this is invoked, we only care about the final mockStoreState

            .verifiable(Times.atLeastOnce());

        return depsMock;
    }
});
