// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import {
    AndroidSetupStateMachineFactory,
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { StateMachine } from 'electron/platform/android/setup/state-machine/state-machine';
import { createStateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-step-configs';
import { AndroidSetupStepDeps } from './android-setup-step-deps';
import { allAndroidSetupStepConfigs } from './android-setup-steps-configs';
import { StateMachineSteps } from './state-machine/state-machine-steps';

type AndroidSetupStepsFactory = (
    stepTransition: AndroidSetupStepTransitionCallback,
) => StateMachineSteps<AndroidSetupStepId, AndroidSetupActions>;

const stepsFactory = (
    deps: Omit<AndroidSetupStepDeps & AndroidSetupStoreCallbacks, 'stepTransition'>,
): AndroidSetupStepsFactory => {
    return (stateMachineStepTransition: AndroidSetupStepTransitionCallback) => {
        const allDeps = {
            ...deps,
            stepTransition: stateMachineStepTransition,
        };

        return createStateMachineSteps(allDeps, allAndroidSetupStepConfigs);
    };
};

export const createAndroidSetupStateMachineFactory = (
    deps: AndroidSetupStepDeps,
): AndroidSetupStateMachineFactory => {
    return (storeCallbacks: AndroidSetupStoreCallbacks) => {
        return new StateMachine<AndroidSetupStepId, AndroidSetupActions>(
            stepsFactory({ ...deps, ...storeCallbacks }),
            storeCallbacks.stepTransition,
            'detect-adb',
        );
    };
};
