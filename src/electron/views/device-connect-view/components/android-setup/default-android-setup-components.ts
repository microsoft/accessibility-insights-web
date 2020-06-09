// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepComponentProvider } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectAdbStep } from 'electron/views/device-connect-view/components/android-setup/detect-adb-step';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';

export const defaultAndroidSetupComponents: AndroidSetupStepComponentProvider = {
    'detect-adb': DetectAdbStep,
    'prompt-locate-adb': PromptLocateAdbStep,
    'prompt-connect-to-device': PromptConnectToDeviceStep,
};
