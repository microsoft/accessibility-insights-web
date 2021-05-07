// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptConnectedStartTesting: AndroidSetupStepConfig = (stepTransition, deps) => ({
    actions: {
        cancel: () => stepTransition('prompt-choose-device'),
        rescan: () => stepTransition('detect-devices'),
        readyToStart: () => stepTransition('prompt-connect-to-device'), // Reset state after leaving setup dialogs
    },
});
