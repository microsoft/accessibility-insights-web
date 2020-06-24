// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptConfiguringPortForwardingFailed: AndroidSetupStepConfig = deps => {
    return {
        actions: {
            cancel: () => {
                deps.stepTransition('prompt-choose-device');
            },
            next: () => deps.stepTransition('configuring-port-forwarding'),
        },
    };
};
