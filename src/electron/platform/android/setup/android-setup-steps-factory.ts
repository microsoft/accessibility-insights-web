// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStepDeps } from 'electron/platform/android/setup/android-setup-step-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { StateMachineStep } from 'electron/platform/android/setup/state-machine/state-machine-step';
import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';
import { mapValues } from 'lodash';

type AndroidSetupStepConfig = (deps: AndroidSetupStepDeps) => StateMachineStep<AndroidSetupActions>;

type AndroidSetupStepConfigs = {
    [stepId in AndroidSetupStepId]: AndroidSetupStepConfig;
};

const allAndroidSetupStepConfigs: AndroidSetupStepConfigs = {
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

export const createAndroidSetupSteps = (
    deps: AndroidSetupStepDeps,
): StateMachineSteps<AndroidSetupStepId, AndroidSetupActions> => {
    return mapValues(allAndroidSetupStepConfigs, config => config && config(deps));
};
