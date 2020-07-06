// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const promptLocateAdb: AndroidSetupStepConfig = (stepTransition, deps) => {
    return {
        actions: {
            saveAdbPath: (path: string) => {
                deps.setAdbPath(path);
                stepTransition('detect-adb');
            },
        },
    };
};
