// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: configuringPortForwarding', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = configuringPortForwarding(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing on success', async () => {
        const appName = 'my app name';

        const tcpForwardingPromise = new Promise<boolean>(resolve => resolve(true));
        const appNamePromise = new Promise<string>(resolve => resolve(appName));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.setTcpForwarding())
            .returns(_ => tcpForwardingPromise)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-connected-start-testing'));

        depsMock
            .setup(m => m.getApplicationName())
            .returns(_ => appNamePromise)
            .verifiable(Times.once());

        depsMock.setup(m => m.setApplicationName(undefined)).verifiable(Times.once());
        depsMock.setup(m => m.setApplicationName(appName)).verifiable(Times.once());

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-configuring-port-forwarding-failed on failure', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.setTcpForwarding())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.setApplicationName(undefined)).verifiable(Times.once());

        depsMock
            .setup(m => m.stepTransition('prompt-configuring-port-forwarding-failed'))
            .verifiable(Times.once());

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });
});
