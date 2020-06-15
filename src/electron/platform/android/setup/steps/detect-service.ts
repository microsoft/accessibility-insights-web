// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectService: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        const detected = await deps.hasExpectedServiceVersion();
        deps.stepTransition(detected ? 'detect-permissions' : 'prompt-install-service');
    },
});
