// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { detectAdb } from 'electron/platform/android/setup/steps/detect-adb';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: detectAdb', () => {
    let depsMock: IMock<AndroidSetupDeps>;
    let storeCallbacksMock: IMock<AndroidSetupStoreCallbacks>;
    let stepTransitionMock: IMock<AndroidSetupStepTransitionCallback>;

    beforeEach(() => {
        depsMock = Mock.ofType<AndroidSetupDeps>(undefined, MockBehavior.Strict);
        storeCallbacksMock = Mock.ofType<AndroidSetupStoreCallbacks>(
            undefined,
            MockBehavior.Strict,
        );
        stepTransitionMock = Mock.ofInstance((_: AndroidSetupStepId) => {});
    });

    afterEach(() => {
        depsMock.verifyAll();
        storeCallbacksMock.verifyAll();
        stepTransitionMock.verifyAll();
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupDeps;
        const step = detectAdb(null, deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connect-to-device as expected', async () => {
        const p = Promise.resolve(true);

        depsMock
            .setup(m => m.hasAdbPath())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('detect-devices')).verifiable(Times.once());

        const step = detectAdb(stepTransitionMock.object, depsMock.object);
        await step.onEnter();
    });

    it('onEnter transitions to prompt-locate-adb as expected', async () => {
        const p = Promise.resolve(false);

        depsMock
            .setup(m => m.hasAdbPath())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-locate-adb')).verifiable(Times.once());

        const step = detectAdb(stepTransitionMock.object, depsMock.object);
        await step.onEnter();
    });
});
