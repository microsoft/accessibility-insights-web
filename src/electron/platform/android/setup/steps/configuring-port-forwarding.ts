// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const configuringPortForwarding: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        deps.setApplicationName(); // init

        const configured = await deps.setTcpForwarding();

        if (configured === false) {
            deps.stepTransition('prompt-configuring-port-forwarding-failed');
            return;
        }

        // device is good to go; so we can get the current app name
        const appName = await deps.getApplicationName();
        deps.setApplicationName(appName);
        deps.stepTransition('prompt-connected-start-testing');
    },
});
