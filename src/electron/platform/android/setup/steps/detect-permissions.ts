// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectPermissions: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        const detected = await deps.hasExpectedPermissions();
        deps.stepTransition(
            detected ? 'prompt-connected-start-testing' : 'prompt-grant-permissions',
        );
    },
});
