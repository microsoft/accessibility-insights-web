// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const configuringPortForwarding: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        try {
            const existingPort = deps.getScanPort();
            if (existingPort != null) {
                deps.logger.log(`removing old tcp:${existingPort} forwarding`);
                await deps.removeTcpForwarding(existingPort);
                deps.setScanPort(null);
                deps.setApplicationName(null);
            }

            const hostPort = await deps.setupTcpForwarding();
            deps.logger.log(`configured forwarding to tcp:${hostPort}`);
            const deviceConfig = await deps.fetchDeviceConfig(hostPort);

            deps.setScanPort(hostPort);
            deps.setApplicationName(deviceConfig.appIdentifier);
            deps.stepTransition('prompt-connected-start-testing');
        } catch (e) {
            deps.logger.error(e);
            deps.stepTransition('prompt-configuring-port-forwarding-failed');
        }
    },
});
