// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptConnectToDevice } from 'electron/platform/android/setup/steps/prompt-connect-to-device';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptConnectToDevice', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptConnectToDevice(deps);
        checkExpectedActionsAreDefined(step, ['next']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('next transitions to detect-devices as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('detect-devices')).verifiable(Times.once());

        const step = promptConnectToDevice(depsMock.object);
        step.actions.next();

        depsMock.verifyAll();
    });
});
