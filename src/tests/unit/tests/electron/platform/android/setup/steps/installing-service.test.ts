// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { installingService } from 'electron/platform/android/setup/steps/installing-service';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: installingService', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = installingService(deps);
        checkExpectedActionsAreDefined(step, ['cancel']);
        expect(step.onEnter).toBeDefined();
    });

    it('cancel transitions to prompt-grant-permissions as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('prompt-install-service')).verifiable(Times.once());

        const step = installingService(depsMock.object);
        step.actions.cancel();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-grant-permissions as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.installService())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-grant-permissions')).verifiable(Times.once());

        const step = installingService(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-install-service as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.installService())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-install-failed')).verifiable(Times.once());

        const step = installingService(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });
});
