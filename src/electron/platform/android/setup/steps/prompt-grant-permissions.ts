// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptGrantPermissions: AndroidSetupStepConfig = stepTransition => ({
    actions: {
        cancel: () => stepTransition('prompt-choose-device'),
        next: () => stepTransition('detect-permissions'),
    },
});
