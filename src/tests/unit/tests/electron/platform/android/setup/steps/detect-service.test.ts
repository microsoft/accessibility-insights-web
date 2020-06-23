// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { detectService } from 'electron/platform/android/setup/steps/detect-service';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: detectService', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = detectService(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to detect-permissions as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.hasExpectedServiceVersion())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('detect-permissions')).verifiable(Times.once());

        const step = detectService(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-install-service as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.hasExpectedServiceVersion())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-install-service')).verifiable(Times.once());

        const step = detectService(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });
});
