// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectService: AndroidSetupStepConfig = (stepTransition, deps) => ({
    actions: {},
    onEnter: async () => {
        const detected = await deps.hasExpectedServiceVersion();
        stepTransition(detected ? 'detect-permissions' : 'prompt-install-service');
    },
});
