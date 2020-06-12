// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptGrantPermissions } from 'electron/platform/android/setup/steps/prompt-grant-permissions';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptGrantPermissions', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptGrantPermissions(deps);
        checkExpectedActionsAreDefined(step, ['next']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('onEnter transitions to detect-permissions as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('detect-permissions')).verifiable(Times.once());

        const step = promptGrantPermissions(depsMock.object);
        step.actions.next();

        depsMock.verifyAll();
    });
});
