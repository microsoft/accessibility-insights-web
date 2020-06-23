// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptLocateAdb } from 'electron/platform/android/setup/steps/prompt-locate-adb';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptLocateAdb', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptLocateAdb(deps);
        checkExpectedActionsAreDefined(step, ['saveAdbPath']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('saveAdbPath transitions to prompt-connect-to-device as expected', () => {
        const testPath = 'my test path';

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.setAdbPath(testPath)).verifiable(Times.once());
        depsMock.setup(m => m.stepTransition('detect-adb')).verifiable(Times.once());

        const step = promptLocateAdb(depsMock.object);
        step.actions.saveAdbPath(testPath);

        depsMock.verifyAll();
    });
});
