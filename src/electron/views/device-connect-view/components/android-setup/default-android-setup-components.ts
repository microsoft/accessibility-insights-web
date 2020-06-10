// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepComponentProvider } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectAdbStep } from 'electron/views/device-connect-view/components/android-setup/detect-adb-step';
import { DetectDevicesStep } from 'electron/views/device-connect-view/components/android-setup/detect-devices-step';
import { DetectServiceStep } from 'electron/views/device-connect-view/components/android-setup/detect-service-step';
import { InstallingServiceStep } from 'electron/views/device-connect-view/components/android-setup/installing-service-step';
import { PromptChooseDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-choose-device-step';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { PromptInstallFailedStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-failed-step';
import { PromptInstallServiceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';

export const defaultAndroidSetupComponents: AndroidSetupStepComponentProvider = {
    'detect-adb': DetectAdbStep,
    'prompt-locate-adb': PromptLocateAdbStep,
    'prompt-choose-device': PromptChooseDeviceStep,
    'prompt-connect-to-device': PromptConnectToDeviceStep,
    'prompt-install-service': PromptInstallServiceStep,
    'prompt-install-failed': PromptInstallFailedStep,
    'installing-service': InstallingServiceStep,
    'detect-devices': DetectDevicesStep,
    'detect-service': DetectServiceStep,
};
