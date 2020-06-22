// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: configuringPortForwarding', () => {
    const noopLogger = Mock.ofType<Logger>().object;

    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = configuringPortForwarding(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing on success', async () => {
        const scanPort = 63000;
        const appName = 'my app name';

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);

        depsMock.setup(m => m.logger).returns(() => noopLogger);
        depsMock
            .setup(m => m.setTcpForwarding())
            .returns(() => Promise.resolve(scanPort))
            .verifiable(Times.once());

        depsMock
            .setup(m => m.getApplicationName())
            .returns(_ => Promise.resolve(appName))
            .verifiable(Times.once());

        depsMock.setup(m => m.setScanPort(scanPort)).verifiable(Times.once());
        depsMock.setup(m => m.setApplicationName(appName)).verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-connected-start-testing'));

        const step = configuringPortForwarding(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-configuring-port-forwarding-failed on failure', async () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.logger).returns(() => noopLogger);
        depsMock
            .setup(m => m.setTcpForwarding())
            .returns(() => Promise.reject(new Error('test error')))
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
