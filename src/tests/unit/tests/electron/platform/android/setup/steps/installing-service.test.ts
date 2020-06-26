// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { installingService } from 'electron/platform/android/setup/steps/installing-service';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: installingService', () => {
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
        const step = installingService(null, deps);
        checkExpectedActionsAreDefined(step, ['cancel']);
        expect(step.onEnter).toBeDefined();
    });

    it('cancel transitions to prompt-grant-permissions as expected', () => {
        stepTransitionMock.setup(m => m('prompt-install-service')).verifiable(Times.once());

        const step = installingService(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.cancel();
    });

    it('onEnter transitions to prompt-grant-permissions as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(true));

        depsMock
            .setup(m => m.installService())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-grant-permissions')).verifiable(Times.once());

        const step = installingService(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });

    it('onEnter transitions to prompt-install-service as expected', async () => {
        const p = new Promise<boolean>(resolve => resolve(false));

        depsMock
            .setup(m => m.installService())
            .returns(_ => p)
            .verifiable(Times.once());

        stepTransitionMock.setup(m => m('prompt-install-failed')).verifiable(Times.once());

        const step = installingService(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });
});
