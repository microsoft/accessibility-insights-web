// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { promptGrantPermissions } from 'electron/platform/android/setup/steps/prompt-grant-permissions';
import { checkExpectedActionsAreDefined } from 'tests/unit/tests/electron/platform/android/setup/steps/actions-tester';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('Android setup step: promptGrantPermissions', () => {
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
        const step = promptGrantPermissions(null, deps);
        checkExpectedActionsAreDefined(step, ['cancel', 'next']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('cancel transitions to prompt-choose-device', async () => {
        stepTransitionMock.setup(m => m('prompt-choose-device')).verifiable(Times.once());

        const step = promptGrantPermissions(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.cancel();
    });

    it('onEnter transitions to detect-permissions as expected', () => {
        stepTransitionMock.setup(m => m('detect-permissions')).verifiable(Times.once());

        const step = promptGrantPermissions(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.next();
    });
});
