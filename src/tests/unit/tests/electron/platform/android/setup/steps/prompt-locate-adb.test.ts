// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { promptLocateAdb } from 'electron/platform/android/setup/steps/prompt-locate-adb';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptLocateAdb', () => {
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
        const step = promptLocateAdb(null, deps);
        checkExpectedActionsAreDefined(step, ['saveAdbPath']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('saveAdbPath transitions to prompt-connect-to-device as expected', () => {
        const testPath = 'my test path';

        depsMock.setup(m => m.setAdbPath(testPath)).verifiable(Times.once());
        stepTransitionMock.setup(m => m('detect-adb')).verifiable(Times.once());

        const step = promptLocateAdb(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.saveAdbPath(testPath);
    });
});
