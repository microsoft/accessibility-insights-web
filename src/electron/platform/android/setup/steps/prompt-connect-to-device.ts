// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptConnectToDevice: AndroidSetupStepConfig = deps => {
    return {
        actions: {
            next: () => deps.stepTransition('detect-devices'),
        },
    };
};
