// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepDeps } from 'electron/platform/android/setup/android-setup-step-deps';
import { detectAdb } from 'electron/platform/android/setup/steps/detect.adb';
import { checkExpectedActionsAreDefined } from 'tests/unit/tests/electron/platform/android/setup/steps/actions-tester';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('Android setup step: detectAdb', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepDeps;
        const step = detectAdb(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to detect-devices as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        const depsMock = Mock.ofType<AndroidSetupStepDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.detectAdb())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('detect-devices')).verifiable(Times.once());

        const step = detectAdb(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-locate-adb as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        const depsMock = Mock.ofType<AndroidSetupStepDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.detectAdb())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.stepTransition('prompt-locate-adb')).verifiable(Times.once());

        const step = detectAdb(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });
});
