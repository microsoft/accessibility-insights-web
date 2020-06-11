// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStoreCallbacks } from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupStepDeps } from 'electron/platform/android/setup/android-setup-step-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import {
    StateMachineStepConfig,
    StateMachineStepConfigs,
} from './state-machine/state-machine-step-configs';
import { detectAdb } from './steps/detect.adb';

export type AndroidSetupStepConfig = StateMachineStepConfig<
    AndroidSetupActions,
    AndroidSetupStepDeps & AndroidSetupStoreCallbacks
>;

type AndroidSetupStepConfigs = StateMachineStepConfigs<
    AndroidSetupStepId,
    AndroidSetupActions,
    AndroidSetupStepDeps
>;

export const allAndroidSetupStepConfigs: AndroidSetupStepConfigs = {
    'detect-adb': detectAdb,
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
