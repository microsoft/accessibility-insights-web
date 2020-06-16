// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptConnectedStartTesting: AndroidSetupStepConfig = deps => ({
    actions: {
        rescan: () => {
            deps.stepTransition('detect-adb');
        },
    },
});
