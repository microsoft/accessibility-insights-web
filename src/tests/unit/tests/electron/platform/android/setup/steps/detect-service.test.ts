// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { detectService } from 'electron/platform/android/setup/steps/detect-service';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: detectService', () => {
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
        const step = detectService(null, deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to detect-permissions as expected', async () => {
        const p = Promise.resolve(true);

        depsMock
            .setup(m => m.hasExpectedServiceVersion())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('detect-permissions')).verifiable(Times.once());

        const step = detectService(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });

    it('onEnter transitions to prompt-install-service as expected', async () => {
        const p = Promise.resolve(false);

        depsMock
            .setup(m => m.hasExpectedServiceVersion())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-install-service')).verifiable(Times.once());

        const step = detectService(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });
});
