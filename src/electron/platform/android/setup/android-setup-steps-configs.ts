// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStoreCallbacks } from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { configuringPortForwarding } from 'electron/platform/android/setup/steps/configuring-port-forwarding';
import { detectDevices } from 'electron/platform/android/setup/steps/detect-devices';
import { detectPermissions } from 'electron/platform/android/setup/steps/detect-permissions';
import { detectService } from 'electron/platform/android/setup/steps/detect-service';
import { grantOverlayPermission } from 'electron/platform/android/setup/steps/grant-overlay-permission';
import { installingService } from 'electron/platform/android/setup/steps/installing-service';
import { promptChooseDevice } from 'electron/platform/android/setup/steps/prompt-choose-device';
import { promptConfiguringPortForwardingFailed } from 'electron/platform/android/setup/steps/prompt-configuring-port-forwarding-failed';
import { promptConnectToDevice } from 'electron/platform/android/setup/steps/prompt-connect-to-device';
import { promptConnectedStartTesting } from 'electron/platform/android/setup/steps/prompt-connected-start-testing';
import { promptGrantPermissions } from 'electron/platform/android/setup/steps/prompt-grant-permissions';
import { promptInstallService } from 'electron/platform/android/setup/steps/prompt-install-service';
import { promptLocateAdb } from 'electron/platform/android/setup/steps/prompt-locate-adb';
import { waitToStart } from 'electron/platform/android/setup/steps/wait-to-start';
import {
    StateMachineStepConfig,
    StateMachineStepConfigs,
} from './state-machine/state-machine-step-configs';
import { detectAdb } from './steps/detect-adb';

export type AndroidSetupStepConfig = StateMachineStepConfig<
    AndroidSetupStepId,
    AndroidSetupActions,
    AndroidSetupDeps,
    AndroidSetupStoreCallbacks
>;

type AndroidSetupStepConfigs = StateMachineStepConfigs<
    AndroidSetupStepId,
    AndroidSetupActions,
    AndroidSetupDeps,
    AndroidSetupStoreCallbacks
>;

export const allAndroidSetupStepConfigs: AndroidSetupStepConfigs = {
    'wait-to-start': waitToStart,
    'detect-adb': detectAdb,
    'prompt-locate-adb': promptLocateAdb,
    'prompt-connect-to-device': promptConnectToDevice,
    'detect-devices': detectDevices,
    'prompt-choose-device': promptChooseDevice,
    'detect-service': detectService,
    'prompt-install-service': promptInstallService,
    'installing-service': installingService,
    'prompt-install-failed': promptInstallService,
    'detect-permissions': detectPermissions,
    'prompt-grant-permissions': promptGrantPermissions,
    'grant-overlay-permission': grantOverlayPermission,
    'configuring-port-forwarding': configuringPortForwarding,
    'prompt-configuring-port-forwarding-failed': promptConfiguringPortForwardingFailed,
    'prompt-connected-start-testing': promptConnectedStartTesting,
};
