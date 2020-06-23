// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptInstallService: AndroidSetupStepConfig = deps => ({
    actions: {
        cancel: () => {
            deps.stepTransition('prompt-choose-device');
        },
        next: () => {
            deps.stepTransition('installing-service');
        },
    },
});
