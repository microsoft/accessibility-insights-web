// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const installingService: AndroidSetupStepConfig = deps => ({
    actions: {
        cancel: () => {
            deps.stepTransition('prompt-install-service');
        },
    },
    onEnter: async () => {
        const installed = await deps.installService();
        deps.stepTransition(installed ? 'prompt-grant-permissions' : 'prompt-install-failed');
    },
});
