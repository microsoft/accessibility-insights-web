// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStepDeps } from 'electron/platform/android/setup/android-setup-step-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { createAndroidSetupSteps } from 'electron/platform/android/setup/android-setup-steps-factory';
import { StateMachineStep } from 'electron/platform/android/setup/state-machine/state-machine-step';
import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';
import { mapValues } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('android setup steps factory', () => {
    it('returns expected steps', () => {
        const stepTransitionMock = Mock.ofInstance((_: AndroidSetupStepId) => {});
        stepTransitionMock.setup(m => m(It.isAny())).verifiable(Times.never());

        const deps: AndroidSetupStepDeps = {
            stepTransition: stepTransitionMock.object,
        };

        // The following object should be filled out with the results of individual step factories
        // called with the deps object created above.
        // Values are allowed to be null while steps are under construction
        const allAndroidSetupSteps: StateMachineSteps<AndroidSetupStepId, AndroidSetupActions> = {
            'detect-adb': null,
            'prompt-locate-adb': null,
            'prompt-connect-to-device': null,
            'detect-devices': null,
            'prompt-choose-device': null,
            'detect-service': null,
            'prompt-install-service': null,
            'installing-service': null,
            'prompt-install-failed': null,
            'detect-permissions': null,
            'prompt-grant-permissions': null,
            'prompt-connected-start-testing': null,
        };

        const steps = createAndroidSetupSteps(deps);
        expect(steps).toStrictEqual(allAndroidSetupSteps);

        stepTransitionMock.verifyAll();
    });
});
