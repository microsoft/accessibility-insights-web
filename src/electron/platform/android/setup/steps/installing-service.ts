// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const installingService: AndroidSetupStepConfig = (stepTransition, deps) => ({
    actions: {
        cancel: () => {
            stepTransition('prompt-install-service');
        },
    },
    onEnter: async () => {
        const installed = await deps.installService();
        stepTransition(installed ? 'prompt-grant-permissions' : 'prompt-install-failed');
    },
});
