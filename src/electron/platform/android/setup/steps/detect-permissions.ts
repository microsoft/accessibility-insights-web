// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectPermissions: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        deps.setApplicationName(); // init

        const detected = await deps.hasExpectedPermissions();

        if (detected === false) {
            deps.stepTransition('prompt-grant-permissions');
            return;
        }

        // device is good to go; so we can get the current app name
        const appName = await deps.getApplicationName();
        deps.setApplicationName(appName);
        deps.stepTransition('configuring-port-forwarding');
    },
});
