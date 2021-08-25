// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepComponentProvider } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectAdbStep } from 'electron/views/device-connect-view/components/android-setup/detect-adb-step';
import { DetectDevicesStep } from 'electron/views/device-connect-view/components/android-setup/detect-devices-step';
import { DetectPermissionsStep } from 'electron/views/device-connect-view/components/android-setup/detect-permissions-step';
import { DetectServiceStep } from 'electron/views/device-connect-view/components/android-setup/detect-service-step';
import { EstablishConnectionStep } from 'electron/views/device-connect-view/components/android-setup/establish-connection-step';
import { GrantOverlayPermissionStep } from 'electron/views/device-connect-view/components/android-setup/grant-overlay-permission-step';
import { InstallingServiceStep } from 'electron/views/device-connect-view/components/android-setup/installing-service-step';
import { PromptChooseDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-choose-device-step';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { PromptConnectedStartTestingStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connected-start-testing-step';
import { PromptEstablishingConnectionFailedStep } from 'electron/views/device-connect-view/components/android-setup/prompt-establishing-connection-failed-step';
import { PromptGrantPermissionsStep } from 'electron/views/device-connect-view/components/android-setup/prompt-grant-permissions-step';
import { PromptInstallFailedStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-failed-step';
import { PromptInstallServiceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';
import { WaitToStartStep } from 'electron/views/device-connect-view/components/android-setup/wait-to-start-step';

export const defaultAndroidSetupComponents: AndroidSetupStepComponentProvider = {
    'wait-to-start': WaitToStartStep,
    'detect-adb': DetectAdbStep,
    'prompt-locate-adb': PromptLocateAdbStep,
    'prompt-choose-device': PromptChooseDeviceStep,
    'prompt-connect-to-device': PromptConnectToDeviceStep,
    'prompt-install-service': PromptInstallServiceStep,
    'prompt-install-failed': PromptInstallFailedStep,
    'prompt-grant-permissions': PromptGrantPermissionsStep,
    'detect-permissions': DetectPermissionsStep,
    'grant-overlay-permission': GrantOverlayPermissionStep,
    'installing-service': InstallingServiceStep,
    'detect-devices': DetectDevicesStep,
    'detect-service': DetectServiceStep,
    'establish-connection': EstablishConnectionStep,
    'prompt-establishing-connection-failed': PromptEstablishingConnectionFailedStep,
    'prompt-connected-start-testing': PromptConnectedStartTestingStep,
};
