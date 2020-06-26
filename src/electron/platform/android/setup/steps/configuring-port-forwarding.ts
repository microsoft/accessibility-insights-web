// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const configuringPortForwarding: AndroidSetupStepConfig = (stepTransition, deps, store) => ({
    actions: {},
    onEnter: async () => {
        try {
            const existingPort = store.getScanPort();
            if (existingPort != null) {
                deps.logger.log(`removing old tcp:${existingPort} forwarding`);
                await deps.removeTcpForwarding(existingPort);
                store.setScanPort(null);
                store.setApplicationName(null);
            }

            const hostPort = await deps.setupTcpForwarding();
            deps.logger.log(`configured forwarding to tcp:${hostPort}`);
            const deviceConfig = await deps.fetchDeviceConfig(hostPort);

            store.setScanPort(hostPort);
            store.setApplicationName(deviceConfig.appIdentifier);
            stepTransition('prompt-connected-start-testing');
        } catch (e) {
            deps.logger.error(e);
            stepTransition('prompt-configuring-port-forwarding-failed');
        }
    },
});
