// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { detectPermissions } from 'electron/platform/android/setup/steps/detect-permissions';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: detectPermissions', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = detectPermissions(deps);
        checkExpectedActionsAreDefined(step, ['cancel']);
        expect(step.onEnter).toBeDefined();
    });

    it('cancel transitions to prompt-choose-device', async () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('prompt-choose-device')).verifiable(Times.once());

        const step = detectPermissions(depsMock.object);
        step.actions.cancel();

        depsMock.verifyAll();
    });

    it('onEnter transitions to configuring-port-forwarding on success', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.hasExpectedPermissions())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('configuring-port-forwarding'));

        const step = detectPermissions(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-grant-permissions on failure', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.hasExpectedPermissions())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-grant-permissions')).verifiable(Times.once());

        const step = detectPermissions(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });
});
