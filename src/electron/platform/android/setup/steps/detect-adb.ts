// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const detectAdb: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        const detected = await deps.hasAdbPath();
        deps.stepTransition(detected ? 'detect-devices' : 'prompt-locate-adb');
    },
});
