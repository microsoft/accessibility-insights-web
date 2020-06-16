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
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connected-start-testing as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.hasExpectedPermissions())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock
            .setup(m => m.stepTransition('prompt-connected-start-testing'))
            .verifiable(Times.once());

        const step = detectPermissions(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-install-service as expected', async () => {
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
