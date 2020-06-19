// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptConfiguringPortForwardingFailed } from 'electron/platform/android/setup/steps/prompt-configuring-port-forwarding-failed';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptConfiguringPortForwardingFailed', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptConfiguringPortForwardingFailed(deps);
        checkExpectedActionsAreDefined(step, ['next']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('next transitions to configuring-port-forwarding as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.stepTransition('configuring-port-forwarding'))
            .verifiable(Times.once());

        const step = promptConfiguringPortForwardingFailed(depsMock.object);
        step.actions.next();

        depsMock.verifyAll();
    });
});
