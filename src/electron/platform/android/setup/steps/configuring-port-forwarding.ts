// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const configuringPortForwarding: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        try {
            deps.setScanPort(null);
            deps.setApplicationName(null);
            const hostPort = await deps.setupTcpForwarding();
            deps.logger.log(`configured forwarding to tcp:${hostPort}`);
            const appName = await deps.getApplicationName();

            deps.setScanPort(hostPort);
            deps.setApplicationName(appName);
            deps.stepTransition('prompt-connected-start-testing');
        } catch (e) {
            deps.logger.error(e);
            deps.stepTransition('prompt-configuring-port-forwarding-failed');
        }
    },
});
