// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { waitToStart } from 'electron/platform/android/setup/steps/wait-to-start';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: waitToStart', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = waitToStart(deps);
        checkExpectedActionsAreDefined(step, ['readyToStart']);
        expect(step.onEnter).not.toBeDefined();
    });
});
