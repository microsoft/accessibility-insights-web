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
import { AndroidSetupDeps } from './android-setup-deps';
import { allAndroidSetupStepConfigs } from './android-setup-steps-configs';
import { StateMachineSteps } from './state-machine/state-machine-steps';

type AndroidSetupStepsFactory = (
    stepTransition: AndroidSetupStepTransitionCallback,
) => StateMachineSteps<AndroidSetupStepId, AndroidSetupActions>;

const stepsFactory = (
    deps: AndroidSetupDeps,
    store: AndroidSetupStoreCallbacks,
): AndroidSetupStepsFactory => {
    return (stateMachineStepTransition: AndroidSetupStepTransitionCallback) => {
        return createStateMachineSteps(
            allAndroidSetupStepConfigs,
            stateMachineStepTransition,
            deps,
            store,
        );
    };
};

export const createAndroidSetupStateMachineFactory = (
    deps: AndroidSetupDeps,
): AndroidSetupStateMachineFactory => {
    return (storeStepTransition, storeCallbacks) => {
        return new StateMachine<AndroidSetupStepId, AndroidSetupActions>(
            stepsFactory(deps, storeCallbacks),
            storeStepTransition,
            // 'wait-to-start',
            'prompt-connected-start-testing',
        );
    };
};
