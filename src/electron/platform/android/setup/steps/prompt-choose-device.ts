// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptChooseDevice: AndroidSetupStepConfig = (stepTransition, deps, store) => {
    return {
        actions: {
            rescan: () => stepTransition('detect-devices'),
            setSelectedDevice: (device: DeviceInfo) => {
                deps.setSelectedDeviceId(device.id);
                store.setSelectedDevice(device);
                stepTransition('detect-service');
            },
        },
    };
};
