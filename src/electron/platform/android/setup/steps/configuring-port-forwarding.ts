// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStoreCallbacks } from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

const removeOldForwardedPort = async (
    deps: AndroidSetupDeps,
    store: AndroidSetupStoreCallbacks,
) => {
    const existingPort = store.getScanPort();
    if (existingPort) {
        try {
            deps.logger.log(`removing old tcp:${existingPort} forwarding`);
            await deps.removeTcpForwarding(existingPort);
        } catch (e) {
            deps.logger.log(`Ignoring error : ${e}`);
        }
        store.setScanPort(null);
    }
};

export const configuringPortForwarding: AndroidSetupStepConfig = (
    stepTransition,
    deps: AndroidSetupDeps,
    store: AndroidSetupStoreCallbacks,
) => ({
    actions: {},
    onEnter: async () => {
        try {
            await removeOldForwardedPort(deps, store);
            store.setApplicationName(null);

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
