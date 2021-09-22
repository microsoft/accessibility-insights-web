// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStoreCallbacks } from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const establishingConnection: AndroidSetupStepConfig = (
    stepTransition,
    deps: AndroidSetupDeps,
    store: AndroidSetupStoreCallbacks,
) => ({
    actions: {},
    onEnter: async () => {
        try {
            store.setApplicationName(null);
            const deviceConfig = await deps.fetchDeviceConfig();
            deps.logger.log(`fetched device config for ${deviceConfig.deviceName}`);
            store.setApplicationName(deviceConfig.appIdentifier);
            stepTransition('prompt-connected-start-testing');
        } catch (e) {
            deps.logger.error(e);
            stepTransition('prompt-establishing-connection-failed');
        }
    },
});
