// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptInstallService } from 'electron/platform/android/setup/steps/prompt-install-service';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptInstallService', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptInstallService(deps);
        checkExpectedActionsAreDefined(step, ['next']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('onEnter transitions to installing-service as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('installing-service')).verifiable(Times.once());

        const step = promptInstallService(depsMock.object);
        step.actions.next();

        depsMock.verifyAll();
    });
});
