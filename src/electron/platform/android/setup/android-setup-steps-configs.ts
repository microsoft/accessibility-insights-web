// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStoreCallbacks } from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { detectDevices } from 'electron/platform/android/setup/steps/detect-devices';
import { detectPermissions } from 'electron/platform/android/setup/steps/detect-permissions';
import { detectService } from 'electron/platform/android/setup/steps/detect-service';
import { installingService } from 'electron/platform/android/setup/steps/installing-service';
import { promptConnectToDevice } from 'electron/platform/android/setup/steps/prompt-connect-to-device';
import { promptConnectedStartTesting } from 'electron/platform/android/setup/steps/prompt-connected-start-testing';
import { promptGrantPermissions } from 'electron/platform/android/setup/steps/prompt-grant-permissions';
import { promptInstallService } from 'electron/platform/android/setup/steps/prompt-install-service';
import { promptLocateAdb } from 'electron/platform/android/setup/steps/prompt-locate-adb';
import {
    StateMachineStepConfig,
    StateMachineStepConfigs,
} from './state-machine/state-machine-step-configs';
import { detectAdb } from './steps/detect-adb';

export type AndroidSetupStepConfigDeps = AndroidSetupDeps & AndroidSetupStoreCallbacks;

export type AndroidSetupStepConfig = StateMachineStepConfig<
    AndroidSetupActions,
    AndroidSetupStepConfigDeps
>;

type AndroidSetupStepConfigs = StateMachineStepConfigs<
    AndroidSetupStepId,
    AndroidSetupActions,
    AndroidSetupStepConfigDeps
>;

export const allAndroidSetupStepConfigs: AndroidSetupStepConfigs = {
    'detect-adb': detectAdb,
    'prompt-locate-adb': promptLocateAdb,
    'prompt-connect-to-device': promptConnectToDevice,
    'detect-devices': detectDevices,
    'prompt-choose-device': null,
    'detect-service': detectService,
    'prompt-install-service': promptInstallService,
    'installing-service': installingService,
    'prompt-install-failed': promptInstallService,
    'detect-permissions': detectPermissions,
    'prompt-grant-permissions': promptGrantPermissions,
    'configuring-port-forwarding': null, // to be implemented in future feature work
    'prompt-configuring-port-forwarding-failed': null, // to be implemented in future feature work
    'prompt-connected-start-testing': promptConnectedStartTesting,
};
