// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptChooseDevice: AndroidSetupStepConfig = deps => {
    return {
        actions: {
            rescan: () => deps.stepTransition('detect-devices'),
            setSelectedDevice: (device: DeviceInfo) => {
                deps.setSelectedDeviceId(device.id);
                deps.setSelectedDevice(device);
                deps.stepTransition('detect-service');
            },
        },
    };
};
