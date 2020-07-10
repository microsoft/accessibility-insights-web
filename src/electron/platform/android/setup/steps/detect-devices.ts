// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectDevices: AndroidSetupStepConfig = (stepTransition, deps, store) => {
    return {
        actions: {},
        onEnter: async () => {
            store.setSelectedDevice(null);
            store.setAvailableDevices([]);

            const devices = await deps.getDevices().catch(e => {
                deps.logger.error(e);
                return [];
            });

            switch (devices.length) {
                case 0: {
                    stepTransition('prompt-connect-to-device');
                    break;
                }
                case 1: {
                    deps.setSelectedDeviceId(devices[0].id);
                    store.setSelectedDevice(devices[0]);
                    store.setAvailableDevices(devices);
                    stepTransition('detect-service');
                    break;
                }
                default: {
                    store.setAvailableDevices(devices);
                    stepTransition('prompt-choose-device');
                    break;
                }
            }
        },
    };
};
