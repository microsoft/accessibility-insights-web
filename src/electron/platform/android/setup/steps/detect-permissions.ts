// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectPermissions: AndroidSetupStepConfig = (stepTransition, deps) => ({
    actions: {},
    onEnter: async () => {
        const detected = await deps.hasExpectedPermissions();
        stepTransition(detected ? 'grant-overlay-permission' : 'prompt-grant-permissions');
    },
});
